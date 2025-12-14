import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../../../../core/services/orders.service';
import { CreateOrderRequest } from '../../../../shared/models/orders-requests.models';

@Component({
  selector: 'app-order-form-page',
  standalone: false,
  templateUrl: './order-form-page.html',
  styleUrl: './order-form-page.scss'
})
export class OrderFormPage {
  loading = false;
  form: any;

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      requestedTest: ['', Validators.required],
      labCode: [''] // optional
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const req: CreateOrderRequest = {
      patientId: this.form.value.patientId!,
      requestedTest: this.form.value.requestedTest!,
      ...(this.form.value.labCode?.trim() ? { labCode: this.form.value.labCode!.trim() } : {})
    };

    this.ordersService.createOrder(req).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/orders']); },
      error: (err) => { console.error('[OrderFormPage] createOrder error', err); this.loading = false; }
    });
  }
}
