import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject, startWith, switchMap, catchError, of } from 'rxjs';
import { OrdersService } from '../../../../core/services/orders.service';
import { OrderResponse } from '../../../../shared/models/orders.models';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage  {
    private reload$ = new Subject<void>();

  orders$ = this.reload$.pipe(
    startWith(void 0),
    switchMap(() => this.ordersService.getAllOrders()),
    catchError((err) => {
      console.error('[OrdersPage] load error', err);
      return of([] as OrderResponse[]);
    })
  );
    constructor(private ordersService: OrdersService) {}

  reload(): void {
    this.reload$.next();
  }

  getStatusChipColor(status: string): 'primary' | 'accent' | 'warn'| 'success'{
    switch (status) {

      case 'FINISHED':
        return 'primary';

      case 'IN_PROGRESS':
        return 'accent';

      case 'CANCELLED':
        return 'warn';

      case 'CREATED':
        return 'success';
      
        default:
        return 'accent';
    }
  }
  createOrder(patientId: string, requestedTest: string, labCode?: string): void {
  this.ordersService.createOrder({ patientId, requestedTest, labCode }).subscribe({
    next: () => this.reload(),
    error: (err) => console.error('[OrdersPage] createOrder error', err)
  });
}

}