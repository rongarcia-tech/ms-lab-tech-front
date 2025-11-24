import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MOCK_AUTH_USERS, MockAuthUser } from '../../shared/mocks/auth.mocks';
import { UserResponse } from '../../shared/models/user.models';

const TOKEN_KEY = 'mslab_token_mock';
const CURRENT_USER_KEY = 'mslab_current_user_username';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  // lista viva de usuarios mock (se inicializa con MOCK_AUTH_USERS)
  private authUsersSubject = new BehaviorSubject<MockAuthUser[]>([...MOCK_AUTH_USERS]);

  loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  // Login contra la lista viva
  login(username: string, password: string): Observable<boolean> {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const users = this.authUsersSubject.value;

    const match = users.find(
      u =>
        u.username === trimmedUsername &&
        u.password === trimmedPassword,
    );

    if (!match) {
      return of(false);
    }

    const fakeToken = `fake-jwt-token-${match.user.username}`;
    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(CURRENT_USER_KEY, match.user.username);

    this.loggedInSubject.next(true);
    return of(true);
  }

  // Registro de un nuevo usuario TECH en memoria
  registerTech(username: string, email: string, password: string): Observable<'OK' | 'USERNAME_TAKEN'> {
    const trimmedUsername = username.trim();

    const users = this.authUsersSubject.value;

    const exists = users.some(u => u.username === trimmedUsername);
    if (exists) {
      return of('USERNAME_TAKEN');
    }

    const newUser: UserResponse = {
      id: users.length + 1,
      externalId: crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}`,
      username: trimmedUsername,
      email,
      roles: ['ROLE_LAB_TECHNICIAN'],
      labCode: null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newAuthUser: MockAuthUser = {
      username: trimmedUsername,
      password,
      user: newUser,
    };

    this.authUsersSubject.next([...users, newAuthUser]);

    return of('OK');
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getCurrentUser(): UserResponse | null {
    const username = localStorage.getItem(CURRENT_USER_KEY);
    if (!username) {
      return null;
    }

    const users = this.authUsersSubject.value;
    const match = users.find(u => u.user.username === username);
    return match ? match.user : null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
