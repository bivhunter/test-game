import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PlayingFieldComponent } from '../playing-field/playing-field.component';
import { GameControlComponent } from '../game-control/game-control.component';
import { Observable } from 'rxjs';
import { Score } from '../models/game.models';
import { GameService } from '../services/game.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  standalone: true,
  imports: [CommonModule, PlayingFieldComponent, GameControlComponent, MatGridListModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GameComponent implements OnInit {
  public gameTitle = 'Mini Game';
  public title = '';
  public score$: Observable<Score> | null = null;
  public gameService = inject(GameService);

  public ngOnInit() {
    this.title = `${this.gameTitle} ${this.gameService.getFieldSize()}`;
    this.score$ = this.gameService.getCurrentScore();
  }
}
