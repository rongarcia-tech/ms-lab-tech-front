import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  roles$!: Observable<string[]>;

  constructor(private authService: AuthService) {
    this.roles$ = this.authService.roles$;
  }

  private normalize(r: string): string {
    return (r || '').replace(/^ROLE_/, '').trim();
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
}
