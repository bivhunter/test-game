import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'game',
    },
    {
        path: 'game',
        component: GameComponent,
    },
    {
        path: '**',
        redirectTo: 'game',
    },
];
