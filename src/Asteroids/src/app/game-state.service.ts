import { Injectable } from '@angular/core';
import { Bodies, Body, Composite, Engine, Runner } from 'matter-js';

@Injectable()
export class GameStateService {
    public readonly engine: Engine;
    public readonly runner: Runner;

    constructor() {
        this.engine = Engine.create();
        this.engine.gravity.y = 0;

        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        window.setInterval(() => {
            var asteroid = Bodies.rectangle(400, 200, 80, 80);
            Body.setVelocity(asteroid, { x: -3, y: 2 });
            asteroid.frictionAir = 0;

            Composite.add(this.engine.world, [asteroid]);
        }, 1000);
    }
}
