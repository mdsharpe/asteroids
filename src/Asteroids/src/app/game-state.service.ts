import { Injectable } from '@angular/core';
import {
    Bodies,
    Body,
    Composite,
    Engine,
    Events,
    ICollisionCallback,
    Runner,
} from 'matter-js';
import { BehaviorSubject } from 'rxjs';

const COLLISION_CAT_PLAYER = 0x0001;
const COLLISION_CAT_ASTEROID = 0x0002;

const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 5;
const PLAYAREA_HEIGHT = 100;

@Injectable()
export class GameStateService {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly player: Body;
    private readonly playerAlive = new BehaviorSubject<boolean>(false);

    constructor() {
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 },
        });

        this.runner = Runner.create();

        Runner.run(this.runner, this.engine);

        this.player = this.initPlayer();
        this.initControls();
        this.initCollisionDetection();

        window.setInterval(() => {
            const asteroid = this.createAsteroid();
            Composite.add(this.engine.world, [asteroid]);
        }, 1000);

        this.playerAlive.next(true);
    }

    private initPlayer(): Body {
        const player = Bodies.rectangle(
            0,
            PLAYAREA_HEIGHT / 2 - PLAYER_HEIGHT / 2,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            {
                frictionAir: 0.05,
                collisionFilter: { category: COLLISION_CAT_PLAYER },
            }
        );
        Composite.add(this.engine.world, [player]);
        return player;
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
                    { x: 0, y: -0.00005 }
                );
            }

            if (keysDown.has('KeyS')) {
                Body.applyForce(
                    player,
                    {
                        x: player.position.x,
                        y: player.position.y,
                    },
                    { x: 0, y: 0.00005 }
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
        const asteroid = Bodies.circle(200, 50, 10, {
            frictionAir: 0,
            collisionFilter: {
                category: COLLISION_CAT_ASTEROID,
            },
        });

        Body.setVelocity(asteroid, {
            x: Math.random() * -1 - 1,
            y: Math.random() * 2 - 1,
        });

        return asteroid;
    }
}
