import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: success => {
        this.loading = false;

        if (success) {
          this.router.navigate(['/labs']);
        } else {
          this.errorMessage = 'Credenciales inválidas (mock).';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al intentar iniciar sesión (mock).';
      }
    });
  }
}
