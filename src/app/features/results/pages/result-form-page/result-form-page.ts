import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ResultsService } from '../../../../core/services/results.service';
import { CreateLabResultRequest, UpdateLabResultRequest } from '../../../../shared/models/results-requests.models';

@Component({
  selector: 'app-result-form-page',
  standalone: false,
  templateUrl: './result-form-page.html',
  styleUrl: './result-form-page.scss',
})
export class ResultFormPage implements OnInit {
  id: string | null = null;
  isEdit = false;
  loading = false;

  form!: FormGroup;

  statuses = ['PENDING', 'FINAL', 'CANCELLED'];
  flags = ['NORMAL', 'HIGH', 'LOW'];

  constructor(
    private fb: FormBuilder,
    private resultsService: ResultsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      orderExternalId: ['', Validators.required],
      patientId: ['', Validators.required],
      labCode: ['', Validators.required],
      requestedTest: ['', Validators.required],
      testName: ['', Validators.required],

      valueText: [''],
      valueNumber: [null],
      unit: [''],
      referenceRange: [''],
      flag: ['NORMAL'],
      status: ['PENDING', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.loading = true;

      this.resultsService.getResultById(this.id).subscribe({
        next: (r: any) => {
          this.form.patchValue({
            orderExternalId: r.orderExternalId,
            LabCode: r.labCode,
            patientId: r.patientId,
            requestedTest: r.requestedTest,
            testName: r.testName,
            valueText: r.valueText ?? '',
            valueNumber: r.valueNumber ?? null,
            unit: r.unit ?? '',
            referenceRange: r.referenceRange ?? '',
            flag: r.flag ?? 'NORMAL',
            status: r.status ?? 'PENDING',
          });

          // en edit no cambias el “identificador lógico” si lo quieres congelar (opcional).
          // acá lo dejamos editable porque depende de tu backend.
          this.loading = false;
        },
        error: (err) => {
          console.error('[ResultFormPage] getResult error', err);
          this.loading = false;
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    if (!this.isEdit) {
      const req: CreateLabResultRequest = {
        orderExternalId: this.form.value.orderExternalId!,
        patientId: this.form.value.patientId!,
        labCode: this.form.value.labCode!,
        requestedTest: this.form.value.requestedTest!,
        testName: this.form.value.testName!,
        valueText: this.form.value.valueText?.trim() ? this.form.value.valueText.trim() : null,
        valueNumber: this.form.value.valueNumber ?? null,
        unit: this.form.value.unit?.trim() ? this.form.value.unit.trim() : null,
        referenceRange: this.form.value.referenceRange?.trim() ? this.form.value.referenceRange.trim() : null,
        flag: this.form.value.flag ?? null,
        status: this.form.value.status ?? 'PENDING',
      };

      this.resultsService.createResult(req).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/results']);
        },
        error: (err) => {
          console.error('[ResultFormPage] createResult error', err);
          this.loading = false;
        },
      });

      return;
    }

    const req: UpdateLabResultRequest = {
      testCode: this.form.value.testCode!,
      requestedTest: this.form.value.requestedTest!,
      valueText: this.form.value.valueText?.trim() ? this.form.value.valueText.trim() : null,
      valueNumber: this.form.value.valueNumber ?? null,
      unit: this.form.value.unit?.trim() ? this.form.value.unit.trim() : null,
      referenceRange: this.form.value.referenceRange?.trim() ? this.form.value.referenceRange.trim() : null,
      flag: this.form.value.flag ?? null,
      status: this.form.value.status ?? 'PENDING',
    };

    this.resultsService.updateResult(this.id!, req).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/results']);
      },
      error: (err) => {
        console.error('[ResultFormPage] updateResult error', err);
        this.loading = false;
      },
    });
  }
}
