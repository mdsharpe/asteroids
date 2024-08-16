import { Injectable } from '@angular/core';
import { Bodies, Body, Composite, Engine, Runner } from 'matter-js';

@Injectable()
export class GameStateService {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly player: Body;

    constructor() {
        this.engine = Engine.create();
        this.engine.gravity.y = 0;

        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        this.player = Bodies.rectangle(30, 45, 20, 10);
        Composite.add(this.engine.world, [this.player]);

        window.setInterval(() => {
            var asteroid = Bodies.circle(400, 200, 30);
            Body.setVelocity(asteroid, { x: -3, y: 2 });
            asteroid.frictionAir = 0;

            Composite.add(this.engine.world, [asteroid]);
        }, 1000);
    }
}
