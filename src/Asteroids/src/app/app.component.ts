import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateService } from './game-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [GameStateService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Asteroids';
}
