import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_RESULTS_BASE_URL } from '../config/api.config';
import { PageResponse } from '../../shared/models/page-response.models';
import { LabResultResponse } from '../../shared/models/results.models';
import { CreateLabResultRequest, UpdateLabResultRequest } from '../../shared/models/results-requests.models';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  constructor(private http: HttpClient) {}

  // ADMIN/TECH: lista paginada → la adaptamos a array, igual que LabsService
  getAllResults(): Observable<LabResultResponse[]> {
    return this.http
      .get<PageResponse<LabResultResponse>>(`${API_RESULTS_BASE_URL}/results`)
      .pipe(map(r => r.content ?? []));
  }

  // ADMIN/TECH: filtro opcional (si tu backend soporta query params)
  getResultsByOrder(orderExternalId: string): Observable<LabResultResponse[]> {
    const params = new HttpParams().set('orderExternalId', orderExternalId);
    return this.http
      .get<PageResponse<LabResultResponse>>(`${API_RESULTS_BASE_URL}/results`, { params })
      .pipe(map(r => r.content ?? []));
  }

  getResultById(externalId: string): Observable<LabResultResponse> {
    return this.http.get<LabResultResponse>(`${API_RESULTS_BASE_URL}/results/${externalId}`);
  }

  // ADMIN
  createResult(req: CreateLabResultRequest): Observable<LabResultResponse> {
    return this.http.post<LabResultResponse>(`${API_RESULTS_BASE_URL}/results`, req);
  }

  // ADMIN
  updateResult(externalId: string, req: UpdateLabResultRequest): Observable<LabResultResponse> {
    return this.http.put<LabResultResponse>(`${API_RESULTS_BASE_URL}/results/${externalId}`, req);
  }

  // ADMIN
  deleteResult(externalId: string): Observable<void> {
    return this.http.delete<void>(`${API_RESULTS_BASE_URL}/results/${externalId}`);
  }

  // VIEWER (paciente): “mis resultados”
  // Backend recomendado: GET /results/my
  getMyResults(): Observable<LabResultResponse[]> {
    return this.http
      .get<PageResponse<LabResultResponse>>(`${API_RESULTS_BASE_URL}/results/my`)
      .pipe(map(r => r.content ?? []));
  }
}
