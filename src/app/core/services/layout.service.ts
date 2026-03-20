import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly isSidebarCollapsed = signal(false);

  init(): void {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) this.isSidebarCollapsed.set(stored === 'true');
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
    localStorage.setItem('sidebar-collapsed', String(this.isSidebarCollapsed()));
  }
}
