import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cell, CellStatus, Score } from '../models/game.models';
import { MatDialog } from '@angular/material/dialog';
import { ResultModalComponent } from '../result-modal/result-modal.component';

@Injectable({ providedIn: 'root' })
export class GameService {
  
  private fieldWidth = 10;
  private fieldHeight = 10;
  private pointsForWin = 10;
  
  private currentScore: Score = { user: 0, computer: 0};
  private currentField = this.generateField();

  private currentField$ = new BehaviorSubject<Cell[]>(this.currentField);
  private currentScore$ = new BehaviorSubject<Score>(this.currentScore);
  private isGameStarted$ = new BehaviorSubject<boolean>(false);

  private timerId = 0;
  private currentCellId: number | null = null;
  private delay = 2000;
  private dialog = inject(MatDialog);

  public getCurrentField(): Observable<Cell[]> {
    return this.currentField$.asObservable();
  }

  public getFieldSize(): string {
    return `${this.fieldHeight} x ${this.fieldWidth}`;
  }

  public getCurrentScore(): Observable<Score> {
    return this.currentScore$.asObservable();
  }

  public getFieldWidth(): number {
    return this.fieldWidth;
  }

  public getIsGameStarted(): Observable<boolean> {
    return this.isGameStarted$.asObservable();
  }

  public startGame(delay: number): void {
      this.delay = delay;
      this.isGameStarted$.next(true);

      this.startRound();
  }

  public clickCell(cell: Cell) {
    if (cell.id !== this.currentCellId) {
      return;
    }

    this.endRound(true);
  }

  private resetField(): void {
    this.currentField = this.generateField();
    this.currentCellId = null;
    this.currentScore = { user: 0, computer: 0 };
    this.currentField$.next(this.currentField);
    this.currentScore$.next(this.currentScore);
  }

  private endGame(): void {
    this.clearTimer();
    this.isGameStarted$.next(false);
    this.openResultModal();
  }

  private startRound(): void {
    const existedCells: Cell[] = this.currentField
      .filter((cell: Cell) => cell.status === CellStatus.UNTOUCHED);
    this.currentCellId = existedCells[Math.floor(Math.random() * (existedCells.length - 1))]?.id;
    this.currentField[this.currentCellId].status = CellStatus.IN_PROCESS;
    this.currentField$.next(this.currentField);

    this.timerId = window.setTimeout(() => {
      this.endRound(false);
    }, this.delay);
  }

  private endRound(isUserClick: boolean): void {
    this.clearTimer();
    this.updateScore(isUserClick);

    if (this.currentCellId !== null) {
      this.currentField[this.currentCellId].status = isUserClick ? CellStatus.CORRECT : CellStatus.INCORRECT;
      this.currentField$.next(this.currentField);
    }

    if (this.checkLastRound()) {
      this.endGame();
    } else {
      this.startRound();
    }
  }

  private updateScore(isUserClick: boolean): void {
    if (isUserClick) {
      this.currentScore.user ++;
    } else {
      this.currentScore.computer ++;
    }
    this.currentScore$.next(this.currentScore);
  }

  private generateField(): Cell[] {
    return Array.from(Array(this.fieldWidth * this.fieldHeight).keys())
      .map((id: number) => {
          return {
            id: id,
            status: CellStatus.UNTOUCHED,
          }
        });
  }

  private clearTimer(): void {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
  }

  private checkLastRound(): boolean {
    if (this.currentScore.user === this.pointsForWin || this.currentScore.computer === this.pointsForWin) {
      return true;
    }

    const isNoUntouchedExist = !this.currentField.filter((cell: Cell) => cell.status === CellStatus.UNTOUCHED).length
    if (isNoUntouchedExist) {
      return true;
    }

    return false;
  }

  private openResultModal() {
    const dialog = this.dialog.open(ResultModalComponent, {
      data: {
        score: this.currentScore,
      },
    });

    dialog.afterClosed().subscribe(() => this.resetField());
  }

}
