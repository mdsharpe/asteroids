import { Component, inject } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { map, Observable } from 'rxjs';
import { GamePhase } from '../game-phase';
import { Track } from './track';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-musicplayer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './musicplayer.component.html',
    styleUrl: './musicplayer.component.scss',
})
export class MusicplayerComponent {
    private readonly _gameStateService = inject(GameStateService);

    private readonly _track$: Observable<Track> =
        this._gameStateService.gamePhase$.pipe(
            map((gamePhase) => {
                switch (gamePhase) {
                    case GamePhase.menu:
                        return Track.menuLoop;
                    case GamePhase.earlyGame:
                        return Track.earlyGameLoop;
                    case GamePhase.midGame:
                        return Track.midGameLoop;
                    default:
                        return Track.menuIntro;
                }
            })
        );

    public readonly audioSrc$ = this._track$.pipe(
        map((track) => {
            switch (track) {
                case Track.menuIntro:
                    return 'music/menu-intro.opus';
                case Track.menuLoop:
                    return 'music/menu-loop.opus';
                case Track.earlyGameIntro:
                    return 'music/early-game-intro.opus';
                case Track.earlyGameLoop:
                    return 'music/early-game-loop.opus';
                case Track.midGameIntro:
                    return 'music/mid-game-intro.opus';
                case Track.midGameLoop:
                    return 'music/mid-game-loop.opus';
                default:
                    return '';
            }
        })
    );
}
