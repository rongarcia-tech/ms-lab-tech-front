import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserResponse } from '../../shared/models/user.models';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private authService: AuthService,
  ) {}

  getCurrentUser(): Observable<UserResponse> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('No hay usuario autenticado (mock).'));
    }

    return of(user);
  }
}
