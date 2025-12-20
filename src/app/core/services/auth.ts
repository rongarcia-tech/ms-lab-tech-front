import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, catchError, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthLoginRequest, AuthLoginResponse } from '../../shared/models/auth.models';
import { UserResponse } from '../../shared/models/user.models';
import { API_AUTH_BASE_URL } from '../config/api.config';

const TOKEN_KEY = 'mslab_token';
const CURRENT_USER_KEY = 'mslab_current_user';
const ROLES_KEY = 'mslab_roles';

type RegisterResult = 'OK' | 'USERNAME_TAKEN';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  private rolesSubject = new BehaviorSubject<string[]>(this.loadRolesFromStorage());
  roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const body: AuthLoginRequest = { username: username.trim(), password: password.trim() };

    return this.http.post<AuthLoginResponse>(`${API_AUTH_BASE_URL}/auth/login`, body).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);

        // Guardamos roles inmediatos desde el login response
        const roles = Array.isArray(res.roles) ? res.roles : [];
        this.setRoles(roles);

        this.loggedInSubject.next(true);
      }),
      // recomendado: cargar /users/me para tener UserResponse real
      switchMap(() => this.getMe().pipe(
        tap(user => {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

          // Si /users/me trae roles, lo usamos como fuente final
          const roles = Array.isArray(user.roles) ? user.roles : [];
          this.setRoles(roles);
        }),
        map(() => true),
        // si /users/me falla, igual consideramos login OK (roles quedan del login response)
        catchError(() => of(true))
      ))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(ROLES_KEY);
    this.rolesSubject.next([]);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

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

  registerTech(username: string, email: string, password: string): Observable<RegisterResult> {
    const body = {
      username: username.trim(),
      email: email.trim(),
      password,

      // Nota: tu backend final decide el nombre exacto.
      // Si en backend usas hasRole("LAB_TECH"), normalmente roles deben venir como ["ROLE_LAB_TECH"] o ["LAB_TECH"].
      roles: ['LAB_TECH'],

      labCode: null,
      active: true
    };

    return this.http.post(`${API_AUTH_BASE_URL}/users`, body).pipe(
      map(() => 'OK' as RegisterResult),
      catchError(err => {
        if (err?.status === 409) return of('USERNAME_TAKEN' as RegisterResult);

        const msg = (err?.error?.message || err?.error || '').toString().toLowerCase();
        if (msg.includes('username') && msg.includes('exist')) return of('USERNAME_TAKEN' as RegisterResult);

        throw err;
      })
    );
  }

  // =========================
  // Roles helpers (para menú)
  // =========================

  /** Roles actuales (sincrónico) */
  getRoles(): string[] {
    return this.rolesSubject.value;
  }

  /** Normaliza "ROLE_ADMIN" y "ADMIN" a "ADMIN" para comparar */
  private normalizeRole(role: string): string {
    return (role || '').replace(/^ROLE_/, '').trim();
  }

  /** true si tiene el rol (acepta "ADMIN" o "ROLE_ADMIN") */
  hasRole(role: string): boolean {
    const target = this.normalizeRole(role);
    return this.getRoles().some(r => this.normalizeRole(r) === target);
  }

  /** true si tiene cualquiera */
  hasAnyRole(...roles: string[]): boolean {
    return roles.some(r => this.hasRole(r));
  }

  // =========================

  private setRoles(roles: string[]): void {
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    this.rolesSubject.next(roles);
  }

  private loadRolesFromStorage(): string[] {
    // 1) si hay user guardado, preferimos eso
    const currentUser = this.getCurrentUser();
    if (currentUser?.roles?.length) return currentUser.roles;

    // 2) si no, roles directos
    const raw = localStorage.getItem(ROLES_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
