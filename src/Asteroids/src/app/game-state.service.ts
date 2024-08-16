import { Injectable } from '@angular/core';
import {
    Bodies,
    Body,
    Composite,
    Engine,
    Events,
    ICollisionCallback,
    Runner,
    Vector,
    World,
} from 'matter-js';
import { BehaviorSubject } from 'rxjs';

const COLLISION_CAT_PARTICLES = 0x0001;
const COLLISION_CAT_PLAYER = 0x0002;
const COLLISION_CAT_ASTEROID = 0x0004;

const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 5;
const PLAYAREA_HEIGHT = 100;
const PLAYAREA_MINX = -200;
const PLAYAREA_MAXX = 200;

const PLAYER_VACUUMFRICTION = 0.1;
const PLAYER_VACUUMFRICTION_DEAD = 0.02;
const PLAYER_ACCEL = 0.00003;

const ASTEROID_WIDTH = 5;

const STAR_COUNT = 750;
const STAR_WIDTH = 0.2;
const STAR_DEPTH_MIN = 0;
const STAR_DEPTH_MAX = 7;

@Injectable()
export class GameStateService {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly player: Body;
    private readonly playerAlive = new BehaviorSubject<boolean>(false);
    private readonly otherPlayers: Map<string, Body>;
    private readonly _stars: Set<Body>;

    constructor() {
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 },
        });

        this.runner = Runner.create({
            isFixed: true,
        });
        Runner.run(this.runner, this.engine);

        this._stars = this.initStars();
        this.player = this.initPlayer(false);
        this.initControls();
        this.initCollisionDetection();

        window.setInterval(() => {
            const asteroid = this.createAsteroid();
            Composite.add(this.engine.world, [asteroid]);
        }, 500);

        window.setInterval(() => {
            this.cleanup();
        }, 1000);

        this.playerAlive.next(true);

        this.otherPlayers = new Map<string, Body>();
    }

    private initPlayer(isOtherPlayer: boolean): Body {
        var player = Bodies.rectangle(
            0,
            PLAYAREA_HEIGHT / 2 - PLAYER_HEIGHT / 2,
            PLAYER_HEIGHT, // Width set to height because we rotate after creation
            PLAYER_WIDTH, // Height set to width because we rotate after creation
            {
                frictionAir: PLAYER_VACUUMFRICTION,
                collisionFilter: { category: COLLISION_CAT_PLAYER },
            }
        );

        if (player.render.sprite) {
            player.render.sprite.texture = './media/rocketship.svg';
            player.render.sprite.xScale = 0.07;
            player.render.sprite.yScale = 0.07;

            if (isOtherPlayer) {
                player.render.opacity = 0.5;
            }

            Body.setAngle(player, Math.PI / 2);
        }

        this.playerAlive.subscribe((alive) => {
            if (alive) {
                player.frictionAir = PLAYER_VACUUMFRICTION;
            } else {
                player.frictionAir = PLAYER_VACUUMFRICTION_DEAD;
            }
        });

        Composite.add(this.engine.world, [player]);
        return player;
    }

    private initStars(): Set<Body> {
        const stars = new Set<Body>();

        for (let i = 0; i < STAR_COUNT; i++) {
            const depth =
                Math.random() * (STAR_DEPTH_MAX - STAR_DEPTH_MIN) +
                STAR_DEPTH_MIN;

            const star = Bodies.circle(
                Math.random() * (PLAYAREA_MAXX - PLAYAREA_MINX) + PLAYAREA_MINX,
                Math.random() * PLAYAREA_HEIGHT,
                STAR_WIDTH,
                {
                    frictionAir: 0,
                    collisionFilter: {
                        category: COLLISION_CAT_PARTICLES,
                        mask: 0,
                    },
                    render: {
                        fillStyle: 'white',
                        opacity: 1 / (STAR_DEPTH_MAX - (depth - 1)),
                    },
                }
            );

            Body.setVelocity(star, {
                x: depth * -0.05,
                y: 0,
            });

            stars.add(star);
        }

        Composite.add(this.engine.world, [...stars]);

        return stars;
    }

    public handleOtherPlayer(otherPlayer: any) {
        if (this.otherPlayers.has(otherPlayer.id)) {
            let existingPlayer = this.otherPlayers.get(otherPlayer.id);
            existingPlayer!.position.y = otherPlayer.yPos;
        } else {
            const player = this.initPlayer(true);
            this.otherPlayers.set(otherPlayer.id, player);
            console.log("add player: ", otherPlayer.id);
        }
    }

    private initControls(): void {
        const keysDown = new Set<string>();
        document.addEventListener('keydown', (event) => {
            keysDown.add(event.code);
        });
        document.addEventListener('keyup', (event) => {
            keysDown.delete(event.code);
        });

        const onTick = () => {
            const player = this.player;

            if (keysDown.has('KeyW')) {
                Body.applyForce(
                    player,
                    {
                        x: player.position.x,
                        y: player.position.y,
                    },
                    { x: 0, y: -PLAYER_ACCEL }
                );
            }

            if (keysDown.has('KeyS')) {
                Body.applyForce(
                    player,
                    {
                        x: player.position.x,
                        y: player.position.y,
                    },
                    { x: 0, y: PLAYER_ACCEL }
                );
            }

            if (player.position.y < 0) {
                Body.setPosition(player, { x: player.position.x, y: 0 });
                Body.setVelocity(player, { x: 0, y: 0 });
            }

            if (player.position.y > PLAYAREA_HEIGHT - PLAYER_HEIGHT) {
                Body.setPosition(player, {
                    x: player.position.x,
                    y: PLAYAREA_HEIGHT - PLAYER_HEIGHT,
                });
                Body.setVelocity(player, { x: 0, y: 0 });
            }
        };

        this.playerAlive.subscribe((alive) => {
            if (alive) {
                Events.on(this.engine, 'beforeUpdate', onTick);
            } else {
                Events.off(this.engine, 'beforeUpdate', onTick);
            }
        });
    }

    private initCollisionDetection(): void {
        const isPlayerDamagingCollision = (pair: Matter.Pair) => {
            const parties = [pair.bodyA, pair.bodyB];

            if (!parties.some((o) => o === this.player)) {
                return false;
            }

            ///const playerCollidedWith = parties.find((o) => o !== this.player);

            return true;
        };

        const handler: ICollisionCallback = (evt) => {
            if (evt.pairs.some(isPlayerDamagingCollision)) {
                this.playerAlive.next(false);

                window.setTimeout(() => {
                    this.addExplosion(this.player.position);
                }, 0.25);
            }
        };

        Events.on(this.engine, 'collisionStart', handler);
    }

    private createAsteroid(): Body {
        const asteroidTextures = [
            './media/asteroid1.svg',
            './media/asteroid2.svg',
            './media/asteroid3.svg',
            './media/asteroid4.svg',
            './media/asteroid5.svg',
        ];
        const randomTexture =
            asteroidTextures[
                Math.floor(Math.random() * asteroidTextures.length)
            ];

        // Set default scales
        let xScale = 0.1;
        let yScale = 0.1;

        const asteroid = Bodies.circle(
            150,
            Math.random() * 100,
            ASTEROID_WIDTH,
            {
                frictionAir: 0,
                collisionFilter: {
                    category: COLLISION_CAT_ASTEROID,
                },
                render: {
                    sprite: {
                        texture: randomTexture,
                        xScale: xScale,
                        yScale: yScale,
                    },
                },
            }
        );

        Body.setVelocity(asteroid, {
            x: Math.random() * -1 - 1,
            y: Math.random() * 1 - 0.5,
        });

        Body.setAngularVelocity(asteroid, Math.random() * 0.1 - 0.05);

        return asteroid;
    }

    private addExplosion(position: Vector): void {
        const explosionColors = ['red', 'orange', 'white', 'grey'];

        for (let i = 0; i < 50; i++) {
            const explosion = Bodies.circle(position.x, position.y, 0.25, {
                frictionAir: 0,
                collisionFilter: {
                    category: COLLISION_CAT_PARTICLES,
                    mask: 0,
                },
                render: {
                    fillStyle:
                        explosionColors[
                            Math.floor(Math.random() * explosionColors.length)
                        ],
                },
            });

            Body.setVelocity(
                explosion,
                Vector.add(
                    {
                        x: (Math.random() - 0.5) * 0.5,
                        y: (Math.random() - 0.5) * 0.5,
                    },
                    this.player.velocity
                )
            );

            Composite.add(this.engine.world, [explosion]);
        }
    }

    private cleanup(): void {
        this.engine.world.bodies.forEach((body) => {
            if (body.position.x < PLAYAREA_MINX) {
                if (this._stars.has(body)) {
                    Body.setPosition(body, {
                        x: PLAYAREA_MAXX,
                        y: Math.random() * PLAYAREA_HEIGHT,
                    });
                } else {
                    World.remove(this.engine.world, body);
                }
            }
        });
    }
}
