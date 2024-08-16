import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateService } from './game-state.service';
import { MusicplayerComponent } from './musicplayer/musicplayer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MusicplayerComponent],
    providers: [GameStateService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private readonly _gameStateService = inject(GameStateService);

    public ngOnInit(): void {}
}
