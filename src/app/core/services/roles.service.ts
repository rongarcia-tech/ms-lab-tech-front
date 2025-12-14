import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_AUTH_BASE_URL } from '../config/api.config';
import { RoleResponse } from '../../shared/models/role.models';

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private http: HttpClient) {}

   listRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${API_AUTH_BASE_URL}/roles`);
  }
}
