import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersService } from '../../../../core/services/orders.service';
import { OrderResponse } from '../../../../shared/models/orders.models';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage implements OnInit {
  orders$!: Observable<OrderResponse[]>;

  constructor(
    private ordersService: OrdersService,
  ) {}

  ngOnInit(): void {
    this.orders$ = this.ordersService.getAllOrders();
  }

  getStatusChipColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'COMPLETED':
        return 'primary';
      case 'IN_PROGRESS':
      case 'ASSIGNED':
        return 'accent';
      case 'CANCELLED':
        return 'warn';
      default:
        return 'accent';
    }
  }
}