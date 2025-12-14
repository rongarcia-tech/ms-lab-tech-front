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

openMenu(trigger: MatMenuTrigger): void {
  this.cancelClose();

  // si hay otro menú abierto, lo cierro primero
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

  loggedIn$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.loggedIn$ = this.authService.loggedIn$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }
}
