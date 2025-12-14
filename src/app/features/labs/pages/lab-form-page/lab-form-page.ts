import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LabsService } from '../../../../core/services/lab.service';
import { LabResponse } from '../../../../shared/models/labs.models';
import { CreateLabRequest, UpdateLabRequest } from '../../../../shared/models/labs-requests.models';

@Component({
  selector: 'app-lab-form-page',
  standalone: false,
  templateUrl: './lab-form-page.html',
  styleUrl: './lab-form-page.scss'
})
export class LabFormPage implements OnInit {
  id: string | null = null;
  isEdit = false;
  loading = false;

  form!: FormGroup; // ⬅️ declaración sin inicializar

  constructor(
    private fb: FormBuilder,
    private labsService: LabsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ inicialización correcta
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      supportedTests: [''] // solo create
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.loading = true;

      this.form.controls['code'].disable();
      this.form.controls['supportedTests'].disable();

      this.labsService.getLabById(this.id).subscribe({
        next: (lab: LabResponse) => {
          this.form.patchValue({
            code: (lab as any).code ?? '',
            name: (lab as any).name ?? '',
            address: (lab as any).address ?? '',
            phone: (lab as any).phone ?? ''
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('[LabFormPage] getLabById error', err);
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    if (!this.isEdit) {
      const testsCsv = (this.form.value.supportedTests ?? '').trim();
      const supportedTests = testsCsv
        ? testsCsv.split(',')
                  .map((x: string) => x.trim())
                  .filter((x: string) => x.length > 0)
                      : [];

      const req: CreateLabRequest = {
        code: this.form.getRawValue().code,
        name: this.form.value.name,
        address: this.form.value.address,
        phone: this.form.value.phone,
        supportedTests
      };

      this.labsService.createLab(req).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/labs']);
        },
        error: (err) => {
          console.error('[LabFormPage] createLab error', err);
          this.loading = false;
        }
      });

      return;
    }

    const req: UpdateLabRequest = {
      name: this.form.value.name,
      address: this.form.value.address,
      phone: this.form.value.phone
    };

    this.labsService.updateLab(this.id!, req).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/labs']);
      },
      error: (err) => {
        console.error('[LabFormPage] updateLab error', err);
        this.loading = false;
      }
    });
  }
}
