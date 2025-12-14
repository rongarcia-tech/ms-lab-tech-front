import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { RoleResponse } from '../../../../shared/models/role.models';

import { UserService } from '../../../../core/services/user.service';
import { RolesService } from '../../../../core/services/roles.service';
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

  // Ojo: las declaramos, pero NO las inicializamos aquí
  roles$!: Observable<RoleResponse[]>;
  form!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // ✅ ya existe rolesService acá
    this.roles$ = this.rolesService.listRoles().pipe(
      catchError(err => {
        console.error('[UserFormPage] roles error', err);
        return of([] as RoleResponse[]); // fallback
      })
    );

    // ✅ ya existe fb acá, así que es seguro construir el form aquí también
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      labCode: ['', Validators.required],
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
            labCode: u.labCode,
            roles: u.roles ?? ['LAB_TECH'],
            active: !!u.active
          });

          this.form.controls['password'].disable();; // en edit no se cambia aquí
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

    if (!this.isEdit) {
      const req: CreateUserRequest = {
        username: this.form.value.username!,
        email: this.form.value.email!,
        password: this.form.value.password!,
        labCode: this.form.value.labCode!,
        roles: this.form.value.roles ?? ['LAB_TECH'],
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
      email: this.form.value.email!,
      labCode: this.form.value.labCode!,
      roles: this.form.value.roles ?? ['LAB_TECH'],
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
