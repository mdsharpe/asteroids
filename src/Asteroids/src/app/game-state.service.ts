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
const COLLISION_CAT_WALL = 0x0003;

@Injectable()
export class GameStateService {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly player: Body;
    private readonly playerAlive = new BehaviorSubject<boolean>(false);
    private readonly _walls: Body[];

    constructor() {
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 },
        });

        this.runner = Runner.create();

        Runner.run(this.runner, this.engine);

        this.player = this.initPlayer();
        this._walls = this.initWalls();
        this.initControls();
        this.initCollisionDetection();

        window.setInterval(() => {
            const asteroid = this.createAsteroid();
            Composite.add(this.engine.world, [asteroid]);
        }, 1000);

        this.playerAlive.next(true);
    }

    private initPlayer(): Body {
        const player = Bodies.rectangle(0, 45, 10, 5, {
            frictionAir: 0.05,
            collisionFilter: { category: COLLISION_CAT_PLAYER },
        });
        Composite.add(this.engine.world, [player]);
        return player;
    }

    private initWalls(): Body[] {
        const createWall = (y: number) => {
            return Bodies.rectangle(0, y, 1000, 1, {
                isStatic: true,
                collisionFilter: {
                    category: COLLISION_CAT_WALL,
                    mask: COLLISION_CAT_PLAYER,
                },
            });
        };

        const walls = [createWall(0), createWall(100)];
        Composite.add(this.engine.world, walls);
        return walls;
    }

    private initControls(): void {
        const keysDown = new Set<string>();
        document.addEventListener('keydown', (event) => {
            keysDown.add(event.code);
        });
        document.addEventListener('keyup', (event) => {
            keysDown.delete(event.code);
        });

        const handler = () => {
            if (keysDown.has('KeyW')) {
                Body.applyForce(
                    this.player,
                    {
                        x: this.player.position.x,
                        y: this.player.position.y,
                    },
                    { x: 0, y: -0.00005 }
                );
            }

            if (keysDown.has('KeyS')) {
                Body.applyForce(
                    this.player,
                    {
                        x: this.player.position.x,
                        y: this.player.position.y,
                    },
                    { x: 0, y: 0.00005 }
                );
            }
        };

        this.playerAlive.subscribe((alive) => {
            if (alive) {
                Events.on(this.engine, 'beforeUpdate', handler);
            } else {
                Events.off(this.engine, 'beforeUpdate', handler);
            }
        });
    }

    private initCollisionDetection(): void {
        const isPlayerDamagingCollision = (pair: Matter.Pair) => {
            const parties = [pair.bodyA, pair.bodyB];

            if (!parties.some((o) => o === this.player)) {
                return false;
            }

            const playerCollidedWith = parties.find((o) => o !== this.player);

            if (this._walls.some((o) => playerCollidedWith === o)) {
                return false;
            }

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
