import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './settings-confirm-dialog.component.html',
  styleUrl: './settings-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<SettingsConfirmDialogComponent>);

  confirm(): void  { this.dialogRef.close(true);  }
  cancel(): void   { this.dialogRef.close(false); }
}
