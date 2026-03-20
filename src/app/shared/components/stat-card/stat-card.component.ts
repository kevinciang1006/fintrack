import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  imports: [MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  label       = input<string>('');
  value       = input<string>('');
  icon        = input<string>('');
  iconBgClass = input<string>('bg-blue-600');
  trend       = input<'up' | 'down' | 'neutral'>('neutral');
}
