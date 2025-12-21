import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../../../../core/services/orders.service';
import { CreateOrderRequest } from '../../../../shared/models/orders-requests.models';

import { LabsService } from '../../../../core/services/lab.service';
import { LabResponse } from '../../../../shared/models/labs.models';

import { Observable, of, catchError, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-order-form-page',
  standalone: false,
  templateUrl: './order-form-page.html',
  styleUrl: './order-form-page.scss'
})
export class OrderFormPage {
  loading = false;
  form: FormGroup;

  // ✅ labs activos, cacheado
  labs$: Observable<LabResponse[]>;

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private labsService: LabsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      requestedTest: ['', Validators.required],

      // ✅ opcional: null si no selecciona nada
      labCode: this.fb.control<string | null>(null),
    });

    this.labs$ = this.labsService.getAllLabs().pipe(
      map((labs) => (labs ?? []).filter(l => l.active === true)),
      catchError((err) => {
        console.error('[OrderFormPage] labs load error', err);
        return of([] as LabResponse[]);
      }),
      shareReplay(1)
    );
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const patientId = String(this.form.value.patientId ?? '').trim();
    const requestedTest = String(this.form.value.requestedTest ?? '').trim();
    const labCodeRaw = String(this.form.value.labCode ?? '').trim();

    const req: CreateOrderRequest = {
      patientId,
      requestedTest,
      ...(labCodeRaw ? { labCode: labCodeRaw } : {})
    };

    this.ordersService.createOrder(req).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('[OrderFormPage] createOrder error', err);
        this.loading = false;
      }
    });
  }
}
