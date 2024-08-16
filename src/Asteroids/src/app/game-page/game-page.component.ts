import {
    Component,
    ElementRef,
    HostListener,
    inject,
    ViewChild,
} from '@angular/core';

import { GameStateService } from '../game-state.service';
import { Bodies, Body, Composite, Render } from 'matter-js';

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
    private readonly _gameStateService = inject(GameStateService);

    private _render: Matter.Render | null = null;
    private _onBeforeTick: (() => void) | null = null;

    @ViewChild('worldContainer', { static: true })
    private _worldContainer!: ElementRef<HTMLElement>;

    public ngOnInit(): void {
        this._render = Render.create({
            element: this._worldContainer.nativeElement,
            engine: this._gameStateService.engine,
        });

        Render.run(this._render);
    }

    public ngOnDestroy(): void {}

    @HostListener('window:resize', ['$event'])
    public onResize(evt: Event): void {
        console.log('resize');
    }
}
