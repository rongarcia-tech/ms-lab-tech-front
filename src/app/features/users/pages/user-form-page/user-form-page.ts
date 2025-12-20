import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, catchError, map } from 'rxjs';

import { RoleResponse } from '../../../../shared/models/role.models';
import { LabResponse } from '../../../../shared/models/labs.models';

import { UserService } from '../../../../core/services/user.service';
import { RolesService } from '../../../../core/services/roles.service';
import { LabsService } from '../../../../core/services/lab.service';

import { CreateUserRequest, UpdateUserRequest } from '../../../../shared/models/user-requests.models';

@Component({
  selector: 'app-user-form-page',
  standalone: false,
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss'
})
export class UserFormPage implements OnInit {
  id: string | null = null;
  isEdit = false;
  loading = false;

  // streams para selects
  roles$!: Observable<RoleResponse[]>;
  labs$!: Observable<LabResponse[]>;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private rolesService: RolesService,
    private labsService: LabsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // Roles dinámicos
    this.roles$ = this.rolesService.listRoles().pipe(
      catchError(err => {
        console.error('[UserFormPage] roles error', err);
        return of([] as RoleResponse[]);
      })
    );

    // Labs dinámicos (solo active=true), se muestran por name pero el value es code
    this.labs$ = this.labsService.getAllLabs().pipe(
      map(labs => (labs ?? []).filter(l => l.active === true)),
      catchError(err => {
        console.error('[UserFormPage] labs error', err);
        return of([] as LabResponse[]);
      })
    );

    // Form
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],

      // ✅ ahora es select y viaja un solo code
      labCode: this.fb.control<string | null>(null, { validators: [Validators.required] }),

      // ✅ multiple
      roles: this.fb.control<string[]>(['LAB_TECH'], { nonNullable: true }),
      active: this.fb.control<boolean>(true, { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.loading = true;

      this.usersService.getUserById(this.id).subscribe({
        next: (u: any) => {
          this.form.patchValue({
            username: u.username,
            email: u.email,

            // ✅ si backend manda "" lo convertimos a null
            labCode: (u.labCode && String(u.labCode).trim()) ? String(u.labCode).trim() : null,

            roles: Array.isArray(u.roles) && u.roles.length ? u.roles : ['LAB_TECH'],
            active: !!u.active
          });

          this.form.controls['password'].disable(); // en edit no se cambia aquí
          this.loading = false;
        },
        error: (err) => {
          console.error('[UserFormPage] getUser error', err);
          this.loading = false;
        }
      });

    } else {
      // create: password requerido
      this.form.controls['password'].setValidators([Validators.required, Validators.minLength(8)]);
      this.form.controls['password'].updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const normalizeText = (v: unknown): string => String(v ?? '').trim();
    const normalizeRole = (v: unknown): string => normalizeText(v).toUpperCase().replace(/^ROLE_/, '');
    const normalizeLabCode = (v: unknown): string | null => {
      const x = normalizeText(v);
      return x ? x.toUpperCase() : null;
    };

    const username = normalizeText(this.form.value.username);
    const email = normalizeText(this.form.value.email);
    const labCode = normalizeLabCode(this.form.value.labCode);
    const roles = (Array.isArray(this.form.value.roles) ? this.form.value.roles : [])
      .map(normalizeRole)
      .filter((r: string) => r.length > 0);

    if (!this.isEdit) {
      const req: CreateUserRequest = {
        username,
        email,
        password: normalizeText(this.form.value.password),
        labCode: labCode!, // requerido por el form
        roles: roles.length ? roles : ['LAB_TECH'],
        active: !!this.form.value.active,
      };

      this.usersService.createUser(req).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          console.error('[UserFormPage] createUser error', err);
          this.loading = false;
        }
      });

      return;
    }

    const req: UpdateUserRequest = {
      email,
      labCode: labCode!, // requerido por el form
      roles: roles.length ? roles : ['LAB_TECH'],
      active: !!this.form.value.active,
    };

    this.usersService.updateUser(this.id!, req).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('[UserFormPage] updateUser error', err);
        this.loading = false;
      }
    });
  }
}
