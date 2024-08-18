import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, startWith } from 'rxjs';
import { HubConnectionState } from '@microsoft/signalr';

import { GameStateService } from '../game-state.service';

@Component({
    selector: 'app-connection-state-warning',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './connection-state-warning.component.html',
    styleUrl: './connection-state-warning.component.scss',
})
export class ConnectionStateWarningComponent {
    private readonly _gameStateService = inject(GameStateService);
    
    public readonly showingWarning$ =
        this._gameStateService.hubConnectionState$.pipe(
            startWith(this._gameStateService.hubConnectionState),
            map((state) => state !== HubConnectionState.Connected)
        );
}
