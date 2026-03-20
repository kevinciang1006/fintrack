import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../../../core/services/layout.service';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly layoutService = inject(LayoutService);

  protected readonly topNavItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'dashboard',    route: '/dashboard'  },
    { label: 'Markets',    icon: 'trending_up',  route: '/markets'    },
    { label: 'Calculator', icon: 'calculate',    route: '/calculator' },
    { label: 'Ledger',     icon: 'receipt_long', route: '/ledger'     },
  ];

  protected readonly bottomNavItems: NavItem[] = [
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}
