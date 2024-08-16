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
        });

        Render.run(this._render);
    }

    public ngOnDestroy(): void {
        if (this._render) {
            Render.stop(this._render);
        }
    }

    @HostListener('window:resize', ['$event'])
    public onResize(evt: Event): void {
        console.log('resize');
    }
}
