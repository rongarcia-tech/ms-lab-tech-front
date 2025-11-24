import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
