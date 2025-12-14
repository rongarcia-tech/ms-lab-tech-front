import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_LABS_BASE_URL } from '../config/api.config';
import { PageResponse } from '../../shared/models/page-response.models';
import { OrderResponse } from '../../shared/models/orders.models';
import { CreateOrderRequest, AssignLabRequest } from '../../shared/models/orders-requests.models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http
      .get<PageResponse<OrderResponse>>(`${API_LABS_BASE_URL}/orders`)
      .pipe(map(r => r.content ?? []));
  }

  // (si tu UI lo necesita después)
  getOrderById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${API_LABS_BASE_URL}/orders/${id}`);
  }

  createOrder(req: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${API_LABS_BASE_URL}/orders`, req);
  }

  assignLab(orderId: string, req: AssignLabRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${API_LABS_BASE_URL}/orders/${orderId}/assign`, req);
  }

  start(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${API_LABS_BASE_URL}/orders/${orderId}/start`, {});
  }

  finish(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${API_LABS_BASE_URL}/orders/${orderId}/finish`, {});
  }
}
