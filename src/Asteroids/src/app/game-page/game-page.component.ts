import {
    Component,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Render } from 'matter-js';

import { GameStateService } from '../game-state.service';

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
})
export class GamePageComponent implements OnInit, OnDestroy {
    private readonly _state = inject(GameStateService);

    private _render: Matter.Render | null = null;
    private _onBeforeTick: (() => void) | null = null;

    @ViewChild('worldContainer', { static: true })
    private _worldContainer!: ElementRef<HTMLElement>;

    public ngOnInit(): void {
        this._render = Render.create({
            element: this._worldContainer.nativeElement,
            engine: this._state.engine,
            options: {
                wireframes: true,
                showAxes: true,
            },
        });

        Render.run(this._render);

        this.fitToScreen();
    }

    public ngOnDestroy(): void {
        if (this._render) {
            Render.stop(this._render);
        }
    }

    @HostListener('window:resize', ['$event'])
    public onResize(evt: Event): void {
        console.log('resize');

        this.fitToScreen();
    }

    private fitToScreen(): void {
        if (!this._render || !this._worldContainer?.nativeElement) {
            return;
        }

        const container = this._worldContainer.nativeElement;
        const render = this._render;
        const player = this._state.player;

        (<any>Render).setSize(
            render,
            container.clientWidth,
            container.clientHeight
        );

        const padding = {
            x: 200,
            y: 30,
        };

        var bounds = {
            min: { x: Infinity, y: Infinity },
            max: { x: -Infinity, y: -Infinity },
        };

        let min = player.bounds.min,
            max = player.bounds.max;

        min.x += 150;
        max.x += 150;

        if (min.x < bounds.min.x) bounds.min.x = min.x;
        if (max.x > bounds.max.x) bounds.max.x = max.x;
        if (min.y < bounds.min.y) bounds.min.y = min.y;
        if (max.y > bounds.max.y) bounds.max.y = max.y;

        // find ratios
        var width = bounds.max.x - bounds.min.x + 2 * padding.x,
            height = bounds.max.y - bounds.min.y + 2 * padding.y,
            viewHeight = render.canvas.height,
            viewWidth = render.canvas.width,
            outerRatio = viewWidth / viewHeight,
            innerRatio = width / height,
            scaleX = 1,
            scaleY = 1;

        // find scale factor
        if (innerRatio > outerRatio) {
            scaleY = innerRatio / outerRatio;
        } else {
            scaleX = outerRatio / innerRatio;
        }

        // enable bounds
        render.options.hasBounds = true;

        // position and size
        render.bounds.min.x = bounds.min.x;
        render.bounds.max.x = bounds.min.x + width * scaleX;
        render.bounds.min.y = bounds.min.y;
        render.bounds.max.y = bounds.min.y + height * scaleY;

        // center
        render.bounds.min.x += width * 0.5 - width * scaleX * 0.5;
        render.bounds.max.x += width * 0.5 - width * scaleX * 0.5;
        render.bounds.min.y += height * 0.5 - height * scaleY * 0.5;
        render.bounds.max.y += height * 0.5 - height * scaleY * 0.5;

        // padding
        render.bounds.min.x -= padding.x;
        render.bounds.max.x -= padding.x;
        render.bounds.min.y -= padding.y;
        render.bounds.max.y -= padding.y;

        render.options.wireframes = false;
    }
}
