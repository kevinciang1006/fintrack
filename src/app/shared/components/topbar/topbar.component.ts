import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatDividerModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  protected readonly themeService  = inject(ThemeService);
  protected readonly layoutService = inject(LayoutService);
  private readonly router          = inject(Router);

  protected goToSettings(): void { this.router.navigate(['/settings']); }
}
