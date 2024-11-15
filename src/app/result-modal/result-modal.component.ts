import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Score } from '../models/game.models';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultModalComponent {
  public data = inject(MAT_DIALOG_DATA);
  public title = this.getTitle(this.data.score);

  private getTitle(score: Score): string {
    if (score.user > score.computer) {
      return 'You Win!';
    }

    if (score.user < score.computer) {
      return 'Computer Win!';
    }
    
    return 'Draw!';
  }

}
