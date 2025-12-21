import { Component } from '@angular/core';
import { Subject, startWith, switchMap, catchError, of, Observable, map, shareReplay } from 'rxjs';

import { OrdersService } from '../../../../core/services/orders.service';
import { LabsService } from '../../../../core/services/lab.service';

import { OrderResponse } from '../../../../shared/models/orders.models';
import { LabResponse } from '../../../../shared/models/labs.models';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage {
  private reload$ = new Subject<void>();

  // ✅ cachea el resultado del HTTP (no más bucle)
  labs$: Observable<LabResponse[]>;

  selectedLabCodeByOrder: Record<string, string> = {};
  assigningByOrder: Record<string, boolean> = {};

  orders$ = this.reload$.pipe(
    startWith(void 0),
    switchMap(() => this.ordersService.getAllOrders()),
    catchError((err) => {
      console.error('[OrdersPage] load error', err);
      return of([] as OrderResponse[]);
    })
  );

  constructor(
    private ordersService: OrdersService,
    private labsService: LabsService
  ) {
    this.labs$ = this.labsService.getAllLabs().pipe(
      map((labs) => (labs ?? []).filter(l => l.active === true)),
      catchError((err) => {
        console.error('[OrdersPage] labs load error', err);
        return of([] as LabResponse[]);
      }),
      shareReplay(1)
    );
    console.log('Labs observable initialized'+ this.labs$) ;
  }

  reload(): void {
    this.reload$.next();
  }

  getStatusChipColor(status: string): 'primary' | 'accent' | 'warn' | 'success' {
    switch (status) {
      case 'FINISHED': return 'primary';
      case 'IN_PROGRESS': return 'accent';
      case 'CANCELLED': return 'warn';
      case 'CREATED': return 'success';
      default: return 'accent';
    }
  }

  onSelectLab(orderExternalId: string, labCode: string): void {
    this.selectedLabCodeByOrder[orderExternalId] = labCode;
  }

  assignLab(order: OrderResponse): void {
  const orderKey = order.externalId; // para maps locales (selectedLabCodeByOrder)
  const selectedLabCode = this.selectedLabCodeByOrder[orderKey];
  if (!selectedLabCode) return;

  const orderId = (order as any).id ?? order.externalId; // ✅ usa order.id si existe
  this.assigningByOrder[orderKey] = true;

  this.ordersService.assignLabToOrder(orderId, selectedLabCode).subscribe({
    next: () => {
      this.assigningByOrder[orderKey] = false;
      delete this.selectedLabCodeByOrder[orderKey];
      this.reload();
    },
    error: (err) => {
      console.error('[OrdersPage] assignLab error', err);
      this.assigningByOrder[orderKey] = false;
    }
  });
}
// loading por orden para start/finish
transitioningByOrder: Record<string, boolean> = {};

// Decide si hay acción y cuál es
getNextAction(status: string): 'START' | 'FINISH' | null {
  switch (status) {
    case 'ASSIGNED':
      return 'START';
    case 'IN_PROGRESS':
      return 'FINISH';
    default:
      return null; // CREATED / FINISHED / otros
  }
}

getActionLabel(action: 'START' | 'FINISH'): string {
  return action === 'START' ? 'Iniciar' : 'Finalizar';
}

transitionOrder(order: OrderResponse): void {
  const action = this.getNextAction(order.status);
  if (!action) return;

  // key para maps locales
  const orderKey = order.externalId;
  const orderId = (order as any).id as number; // ideal: tipa OrderResponse con id:number

  if (!orderId) {
    console.error('[OrdersPage] order.id missing');
    return;
  }

  this.transitioningByOrder[orderKey] = true;

  const req$ =
    action === 'START'
      ? this.ordersService.startOrder(orderId)
      : this.ordersService.finishOrder(orderId);

  req$.subscribe({
    next: () => {
      this.transitioningByOrder[orderKey] = false;
      this.reload();
    },
    error: (err) => {
      console.error('[OrdersPage] transitionOrder error', err);
      this.transitioningByOrder[orderKey] = false;
    }
  });
}


}
