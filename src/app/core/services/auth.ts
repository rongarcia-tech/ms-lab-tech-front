import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

const TOKEN_KEY = 'mslab_token_mock';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  // MOCK: por ahora cualquier usuario/clave no vacíos "loguea"
  login(username: string, password: string): Observable<boolean> {
    if (!username || !password) {
      return of(false);
    }

    // Guardamos un token falso
    const fakeToken = 'fake-jwt-token-mock';
    localStorage.setItem(TOKEN_KEY, fakeToken);

    this.loggedInSubject.next(true);
    return of(true);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
