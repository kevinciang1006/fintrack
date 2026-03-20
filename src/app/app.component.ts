import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { ThemeService } from './core/services/theme.service';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, SidebarComponent, TopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private themeService   = inject(ThemeService);
  readonly layoutService = inject(LayoutService);
  private router         = inject(Router);

  ngOnInit() {
    this.themeService.init();
    this.layoutService.init();
    // Close mobile sidebar overlay on every navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.layoutService.closeMobileMenu();
      }
    });
  }
}
