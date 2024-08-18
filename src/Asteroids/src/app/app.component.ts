import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateService } from './game-state.service';
import { MusicplayerComponent } from './musicplayer/musicplayer.component';
import { ConnectionStateWarningComponent } from './connection-state-warning/connection-state-warning.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        MusicplayerComponent,
        ConnectionStateWarningComponent,
    ],
    providers: [GameStateService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
