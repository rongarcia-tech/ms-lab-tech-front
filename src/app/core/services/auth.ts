import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MOCK_AUTH_USERS } from '../../shared/mocks/auth.mocks';
import { UserResponse } from '../../shared/models/user.models';

const TOKEN_KEY = 'mslab_token_mock';
const CURRENT_USER_KEY = 'mslab_current_user_username';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  // MOCK: ahora solo acepta credenciales que estén en MOCK_AUTH_USERS
  login(username: string, password: string): Observable<boolean> {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const match = MOCK_AUTH_USERS.find(
      u =>
        u.username === trimmedUsername &&
        u.password === trimmedPassword,
    );

    if (!match) {
      // Credenciales inválidas
      return of(false);
    }

    // Guardamos un token falso (podría incluir el username si quieres)
    const fakeToken = `fake-jwt-token-${match.user.username}`;
    localStorage.setItem(TOKEN_KEY, fakeToken);

    // Guardamos quién es el usuario actual
    localStorage.setItem(CURRENT_USER_KEY, match.user.username);

    this.loggedInSubject.next(true);
    return of(true);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  // Obtener el usuario actual desde el mock, según lo que quedó en localStorage
  getCurrentUser(): UserResponse | null {
    const username = localStorage.getItem(CURRENT_USER_KEY);
    if (!username) {
      return null;
    }

    const match = MOCK_AUTH_USERS.find(u => u.user.username === username);
    return match ? match.user : null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
