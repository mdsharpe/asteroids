import { Routes } from '@angular/router';
import { GamePageComponent } from './game-page/game-page.component';
import { MenuComponent } from './menu/menu.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

export const routes: Routes = [
    {
        path: '',
        component: MenuComponent
    },
    {
        path: 'play',
        component: GamePageComponent,
    },
    {
        path: 'leaderboard',
        component: LeaderboardComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
