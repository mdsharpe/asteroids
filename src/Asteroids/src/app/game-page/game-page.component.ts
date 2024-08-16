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
        if (this._render && this._worldContainer?.nativeElement) {
            const container = this._worldContainer.nativeElement;

            (<any>Render).setSize(
                this._render,
                container.clientWidth,
                container.clientHeight
            );

            Render.lookAt(
                this._render,
                this._state.player,
                {
                    x: 200,
                    y: 30,
                },
                true
            );
        }
    }
}
