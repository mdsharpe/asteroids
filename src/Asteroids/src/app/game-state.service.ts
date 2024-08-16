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
        this.initWalls();
        this.initControls();
        this.initCollisionDetection();

        window.setInterval(() => {
            var asteroid = Bodies.circle(200, 50, 10, { frictionAir: 0 });

            Body.setVelocity(asteroid, {
                x: Math.random() * -1 - 1,
                y: Math.random() * 2 - 1,
            });

            Composite.add(this.engine.world, [asteroid]);
        }, 1000);

        this.playerAlive.next(true);
    }

    private initPlayer(): Body {
        const player = Bodies.rectangle(0, 45, 10, 5, { frictionAir: 0.05 });
        Composite.add(this.engine.world, [player]);
        return player;
    }

    private initWalls(): void {
        Composite.add(this.engine.world, [
            Bodies.rectangle(0, 0, 1000, 1, { isStatic: true }),
            Bodies.rectangle(0, 100, 1000, 1, { isStatic: true }),
        ]);
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
        const handler: ICollisionCallback = (evt) => {
            if (
                evt.pairs.some(
                    (p) => p.bodyA === this.player || p.bodyB === this.player
                )
            ) {
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
}
