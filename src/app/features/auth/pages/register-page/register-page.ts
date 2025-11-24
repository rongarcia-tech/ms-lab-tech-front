import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register-page',
   standalone: false,
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
})
export class RegisterPage {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  hidePassword1 = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
  username: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  password: [
    '',
    [
      Validators.required,
      Validators.minLength(12),
      // al menos una minúscula, una mayúscula, un dígito y un símbolo
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/),
    ],
  ],
  confirmPassword: ['', [Validators.required]],
});
  }

   // 2. Función para alternar la visibilidad
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordVisibility1(): void {
    this.hidePassword1 = !this.hidePassword1;
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.form.invalid || this.loading) {
      return;
    }

    const { username, email, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.authService.registerTech(username, email, password).subscribe({
      next: result => {
        this.loading = false;

        if (result === 'USERNAME_TAKEN') {
          this.errorMessage = 'El nombre de usuario ya está en uso.';
          return;
        }

        this.successMessage = 'Usuario registrado (mock) correctamente. Ahora puedes iniciar sesión.';
        // Si quieres, podrías redirigir directamente:
        // this.router.navigate(['/login']);
        this.form.reset();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al registrar el usuario (mock).';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
