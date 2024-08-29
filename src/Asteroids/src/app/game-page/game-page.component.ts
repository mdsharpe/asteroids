import {
    Component,
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged, map } from 'rxjs';
import { Render } from 'matter-js';

import { GameStateService } from '../game-state.service';
import { Router } from '@angular/router';
import { HubConnectionState } from '@microsoft/signalr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScoresPanelComponent } from '../scores-panel/scores-panel.component';

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [CommonModule, ScoresPanelComponent],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
})
export class GamePageComponent implements OnInit, OnDestroy {
    private readonly _state = inject(GameStateService);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    private _render: Matter.Render | null = null;

    public readonly showingRestartButton$ = this._state.playerAlive$.pipe(
        map((isAlive) => !isAlive),
        distinctUntilChanged()
    );

    @ViewChild('worldContainer', { static: true })
    private _worldContainer!: ElementRef<HTMLElement>;

    public async ngOnInit(): Promise<void> {
        this._render = Render.create({
            element: this._worldContainer.nativeElement,
            engine: this._state.engine,
            options: {
                wireframes: false,
                hasBounds: true,
                showStats: true,
            },
        });

        Render.run(this._render);

        this.fitToScreen();

        this._state.startLocalPlayer();

        this.redirectOnDisconnected();
    }

    public ngOnDestroy(): void {
        if (this._render) {
            Render.stop(this._render);
        }

        this._state.stopLocalPlayer();
    }

    public onRestartClick(): void {
        this._state.startLocalPlayer();
    }

    @HostListener('window:resize', ['$event'])
    public onResize(evt: Event): void {
        this.fitToScreen();
    }

    private fitToScreen(): void {
        if (!this._render || !this._worldContainer?.nativeElement) {
            return;
        }

        const container = this._worldContainer.nativeElement;
        const render = this._render;

        (<any>Render).setSize(
            render,
            container.clientWidth,
            container.clientHeight
        );

        const padding = {
            x: 0,
            y: 0,
        };

        var bounds = {
            min: { x: 0, y: 0 },
            max: { x: 50, y: 100 },
        };

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
    }

    private redirectOnDisconnected() {
        const redirectIfDisconnected = (
            connectionState: HubConnectionState
        ) => {
            if (connectionState !== HubConnectionState.Connected) {
                this._router.navigate(['/']);
            }
        };

        this._state.hubConnectionState$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((connectionState) => {
                redirectIfDisconnected(connectionState);
            });

        redirectIfDisconnected(this._state.hubConnectionState);
    }
}
