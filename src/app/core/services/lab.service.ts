import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LabResponse } from '../../shared/models/labs.models';
import { API_LABS_BASE_URL } from '../config/api.config';
import { map } from 'rxjs/operators';
import { PageResponse } from '../../shared/models/page-response.models';
import { CreateLabRequest, UpdateLabRequest } from '../../shared/models/labs-requests.models';

@Injectable({ providedIn: 'root' })
export class LabsService {
  constructor(private http: HttpClient) {}

   getAllLabs(): Observable<LabResponse[]> {
    return this.http
      .get<PageResponse<LabResponse>>(`${API_LABS_BASE_URL}/labs`)
      .pipe(map(r => r.content ?? []));
  }

  getLabById(id: string): Observable<LabResponse> {
    return this.http.get<LabResponse>(`${API_LABS_BASE_URL}/labs/${id}`);
  }

  createLab(req: CreateLabRequest): Observable<LabResponse> {
    return this.http.post<LabResponse>(`${API_LABS_BASE_URL}/labs`, req);
  }

  updateLab(id: string, req: UpdateLabRequest): Observable<LabResponse> {
    return this.http.put<LabResponse>(`${API_LABS_BASE_URL}/labs/${id}`, req);
  }

  deactivateLab(id: string): Observable<void> {
    return this.http.post<void>(`${API_LABS_BASE_URL}/labs/${id}/deactivate`, {});
  }

  activateLab(id: string): Observable<void> {
    return this.http.post<void>(`${API_LABS_BASE_URL}/labs/${id}/activate`, {});
  }
}
