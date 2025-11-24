import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  goToLogin(redirectTo?: string): void {
    if (redirectTo) {
      this.router.navigate(['/login'], {
        queryParams: { redirectTo },
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
