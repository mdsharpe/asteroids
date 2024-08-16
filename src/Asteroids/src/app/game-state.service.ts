import { Injectable } from '@angular/core';
import { Bodies, Body, Composite, Engine, Events, Runner } from 'matter-js';

@Injectable()
export class GameStateService {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly player: Body;
    public readonly top: Body;
    public readonly bottom: Body;

    constructor() {
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 },
        });

        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        this.player = Bodies.rectangle(0, 45, 10, 5);
        this.player.frictionAir = 0.05;
        Composite.add(this.engine.world, [this.player]);

        this.top = Bodies.rectangle(0, 0, 1000, 1);
        this.top.isStatic = true;
        this.bottom = Bodies.rectangle(0, 100, 1000, 1);
        this.bottom.isStatic = true;
        Composite.add(this.engine.world, [this.top, this.bottom]);

        window.setInterval(() => {
            var asteroid = Bodies.circle(200, 50, 10);
            Body.setVelocity(asteroid, { x: -1, y: 0 });
            asteroid.frictionAir = 0;

            Composite.add(this.engine.world, [asteroid]);
        }, 1000);

        const keysDown = new Set<string>();
        document.addEventListener('keydown', (event) => {
            keysDown.add(event.code);
        });
        document.addEventListener('keyup', (event) => {
            keysDown.delete(event.code);
        });

        Events.on(this.engine, 'beforeUpdate', (event) => {
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
        });
    }
}
