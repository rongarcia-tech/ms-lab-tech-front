import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserResponse } from '../../shared/models/user.models';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import { API_AUTH_BASE_URL } from '../config/api.config';
import { CreateUserRequest, UpdateUserRequest } from '../../shared/models/user-requests.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getCurrentUser(): Observable<UserResponse> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('No hay usuario autenticado.'));
    }

    return of(user);
  }

  listUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${API_AUTH_BASE_URL}/users`);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_AUTH_BASE_URL}/users/${id}`);
  }

  createUser(req: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_AUTH_BASE_URL}/users`, req);
  }

  updateUser(id: string, req: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${API_AUTH_BASE_URL}/users/${id}`, req);
  }
}
