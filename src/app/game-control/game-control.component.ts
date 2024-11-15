import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GameService } from '../services/game.service';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  standalone: true,
  styleUrl: './game-control.component.scss',
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameControlComponent implements OnInit {
  public isGameStarted$: Observable<boolean> = of(false);
  public form: FormGroup = new FormGroup({
    roundDuration: new FormControl('', [
      Validators.required, 
      Validators.min(1), 
      Validators.pattern(/^\d+$/)])
  });
  public errorMessage = signal('')

  private gameService: GameService = inject(GameService);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.isGameStarted$ = this.gameService.getIsGameStarted();
    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateErrorMessage())
  }

  public startGame(): void {
    this.gameService.startGame(this.form.get('roundDuration')?.value);
  }

  updateErrorMessage() {
    if (this.form.get('roundDuration')?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.form.get('roundDuration')?.hasError('min')) {
      this.errorMessage.set('Need positive number');
    } else if (this.form.get('roundDuration')?.hasError('pattern')) {
      this.errorMessage.set('Incorrect number');
    } else {
      this.errorMessage.set('test');
    }
  }
}
