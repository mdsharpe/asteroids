import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateService } from './game-state.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    providers: [GameStateService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        console.log(environment);
    }
    title = 'Asteroids';
}
