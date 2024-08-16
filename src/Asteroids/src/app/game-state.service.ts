import { Injectable } from '@angular/core';
import {
    Bodies,
    Body,
    Composite,
    Engine,
    Events,
    ICollisionCallback,
    Runner,
    World,
} from 'matter-js';
import { BehaviorSubject } from 'rxjs';

const COLLISION_CAT_PLAYER = 0x0001;
const COLLISION_CAT_ASTEROID = 0x0002;
const COLLISION_CAT_STARS = 0x0004;

const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 5;
const PLAYAREA_HEIGHT = 100;
const PLAYAREA_MINX = -200;
const PLAYAREA_MAXX = 200;

const PLAYER_VACUUMFRICTION = 0.1;
const PLAYER_VACUUMFRICTION_DEAD = 0.02;
const PLAYER_ACCEL = 0.00005;

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
        this.player = this.initPlayer();
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
    }

    private initPlayer(): Body {
        var player = Bodies.rectangle(
            0,
            PLAYAREA_HEIGHT / 2 - PLAYER_HEIGHT / 2,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            {
                frictionAir: PLAYER_VACUUMFRICTION,
                collisionFilter: { category: COLLISION_CAT_PLAYER },
            }
        );

        if (player.render.sprite) {
            player.render.sprite.texture = './media/rocketship.svg';
            player.render.sprite.xScale = 0.07;
            player.render.sprite.yScale = 0.07;

            Body.setAngle(player, Math.PI / 2);
        }

        this.playerAlive.subscribe((alive) => {
            if (alive) {
                this.player.frictionAir = PLAYER_VACUUMFRICTION;
            } else {
                this.player.frictionAir = PLAYER_VACUUMFRICTION_DEAD;
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
                    collisionFilter: { category: COLLISION_CAT_STARS, mask: 0 },
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
            }
        };

        this.playerAlive.subscribe((alive) => {
            if (alive) {
                Events.on(this.engine, 'collisionStart', handler);
            } else {
                Events.off(this.engine, 'collisionStart', handler);
            }
        });
    }

    private createAsteroid(): Body {
        const asteroid = Bodies.circle(150, Math.random() * 100, 10, {
            frictionAir: 0,
            collisionFilter: {
                category: COLLISION_CAT_ASTEROID,
            },
        });

        Body.setVelocity(asteroid, {
            x: Math.random() * -1 - 1,
            y: Math.random() * 1 - 0.5,
        });

        return asteroid;
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
