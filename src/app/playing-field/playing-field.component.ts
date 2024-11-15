import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { Cell, CellStatus } from '../models/game.models';
import { Observable, of } from 'rxjs';
import { GameService } from '../services/game.service';


@Component({
  selector: 'app-playing-field',
  templateUrl: './playing-field.component.html',
  styleUrl: './playing-field.component.scss',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlayingFieldComponent implements OnInit {
  
  public field$: Observable<Cell[]> = of([]);
  public fieldWidth = 0;
  public cellTypes: typeof CellStatus = CellStatus;

  private gameService: GameService = inject(GameService);

  public ngOnInit(): void {
    this.field$ = this.gameService.getCurrentField();
    this.fieldWidth = this.gameService.getFieldWidth();
  }

  public click(cell: Cell): void {
    this.gameService.clickCell(cell);
  }
  
}
