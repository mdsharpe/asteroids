import { Component, inject } from '@angular/core';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
  private readonly _gameStateService = inject(GameStateService);
}
