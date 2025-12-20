import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  @Input() showMenuButton = false;
  @Output() menuClick = new EventEmitter<void>();

  activeTrigger: MatMenuTrigger | null = null;
  private closeTimer: any;

  loggedIn$!: Observable<boolean>;
  roles$!: Observable<string[]>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.loggedIn$ = this.authService.loggedIn$;
    this.roles$ = this.authService.roles$;
  }

  // ===== Menú hover =====
  openMenu(trigger: MatMenuTrigger): void {
    this.cancelClose();

    if (this.activeTrigger && this.activeTrigger !== trigger) {
      this.activeTrigger.closeMenu();
    }

    this.activeTrigger = trigger;
    trigger.openMenu();
  }

  scheduleClose(): void {
    this.cancelClose();
    this.closeTimer = setTimeout(() => this.closeActiveMenu(), 150);
  }

  cancelClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  closeActiveMenu(): void {
    this.cancelClose();
    this.activeTrigger?.closeMenu();
    this.activeTrigger = null;
  }
  // =======================

  onMenuClick(): void {
    this.menuClick.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ===== Helpers para template =====
  private normalize(role: string): string {
    return (role || '').replace(/^ROLE_/, '').trim();
  }

  isAdmin(roles: string[] | null | undefined): boolean {
    if (!roles) return false;
    return roles.some(r => this.normalize(r) === 'ADMIN');
  }

  isLabTech(roles: string[] | null | undefined): boolean {
    if (!roles) return false;
    return roles.some(r => {
      const x = this.normalize(r);
      return x === 'LAB_TECH' || x === 'LAB_TECHNICIAN';
    });
  }

  canSeeLabs(roles: string[] | null | undefined): boolean {
    return this.isAdmin(roles) || this.isLabTech(roles);
  }

  canSeeResults(roles: string[] | null | undefined): boolean {
    return this.isAdmin(roles) || this.isLabTech(roles);
  }

  canManageAdmin(roles: string[] | null | undefined): boolean {
    return this.isAdmin(roles);
  }

  canCreateLabsOrdersResults(roles: string[] | null | undefined): boolean {
    return this.isAdmin(roles);
  }
}
