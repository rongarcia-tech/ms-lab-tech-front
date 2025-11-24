import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderResponse } from '../../shared/models/orders.models';
import { MOCK_ORDERS } from '../../shared/mocks/orders.mocks';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor() {}

  getAllOrders(): Observable<OrderResponse[]> {
    // Futuro: HTTP GET a /orders
    return of(MOCK_ORDERS);
  }
}
