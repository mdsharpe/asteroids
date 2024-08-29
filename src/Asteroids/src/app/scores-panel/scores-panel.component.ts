import { Component, inject } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scores-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores-panel.component.html',
  styleUrl: './scores-panel.component.scss'
})
export class ScoresPanelComponent {
  private readonly _state = inject(GameStateService);

  public readonly scoreboard$ = this._state.scoreboard$;
}
