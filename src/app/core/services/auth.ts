import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, catchError, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthLoginRequest, AuthLoginResponse } from '../../shared/models/auth.models';
import { UserResponse } from '../../shared/models/user.models';
import { API_AUTH_BASE_URL } from '../config/api.config';

const TOKEN_KEY = 'mslab_token';
const CURRENT_USER_KEY = 'mslab_current_user';

type RegisterResult = 'OK' | 'USERNAME_TAKEN';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const body: AuthLoginRequest = { username: username.trim(), password: password.trim() };

    return this.http.post<AuthLoginResponse>(`${API_AUTH_BASE_URL}/auth/login`, body).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.loggedInSubject.next(true);
      }),
      // opcional pero recomendado: cargar /users/me para tener UserResponse real
      switchMap(() => this.getMe().pipe(
        tap(user => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))),
        map(() => true),
        // si /users/me falla por cualquier razón, igual consideramos login OK
        catchError(() => of(true))
      ))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Tu app lo usa (UserService). Lo mantenemos.
  getCurrentUser(): UserResponse | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      return null;
    }
  }

  // Backend: GET /users/me (autenticado)
  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_AUTH_BASE_URL}/users/me`);
  }

  // Tu UI lo llama. En backend ES: POST /users (solo ADMIN)
  registerTech(username: string, email: string, password: string): Observable<RegisterResult> {
    const body = {
      username: username.trim(),
      email: email.trim(),
      password,
      // 👇 aquí hay 2 opciones según tu backend:
      // A) si backend recibe roles como string[]:
      roles: ['LAB_TECH'],
      // B) si backend usa ROLE_ prefijo:
      // roles: ['ROLE_LAB_TECH'],

      labCode: null,
      active: true
    };

    return this.http.post(`${API_AUTH_BASE_URL}/users`, body).pipe(
      map(() => 'OK' as RegisterResult),
      catchError(err => {
        // Si tu backend responde 409 por username duplicado:
        if (err?.status === 409) return of('USERNAME_TAKEN' as RegisterResult);

        // Si responde 400 con mensaje “username already exists” etc.:
        const msg = (err?.error?.message || err?.error || '').toString().toLowerCase();
        if (msg.includes('username') && msg.includes('exist')) return of('USERNAME_TAKEN' as RegisterResult);

        // cualquier otro error → lo tratamos como error real
        throw err;
      })
    );
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
