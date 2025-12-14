import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterPage } from './register-page';
import { AuthService } from '../../../../core/services/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['registerTech']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    authServiceMock.registerTech.and.returnValue(of('OK'));
    routerMock.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty fields', () => {
      expect(component.form.get('username')?.value).toBe('');
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
      expect(component.form.get('confirmPassword')?.value).toBe('');
    });

    it('should have invalid form when fields are empty', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form with invalid email', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form with weak password (too short)', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Pass1!',
        confirmPassword: 'Pass1!'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form with password missing uppercase', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123!',
        confirmPassword: 'password123!'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form with password missing lowercase', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'PASSWORD123!',
        confirmPassword: 'PASSWORD123!'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form with password missing digit', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password!',
        confirmPassword: 'Password!'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form with password missing special character', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have valid form with correct password format', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      expect(component.form.valid).toBeTrue();
    });
  });

  describe('Password visibility toggle', () => {
    it('should initialize hidePassword as true', () => {
      expect(component.hidePassword).toBeTrue();
    });

    it('should initialize hidePassword1 as true', () => {
      expect(component.hidePassword1).toBeTrue();
    });

    it('should toggle hidePassword', () => {
      component.hidePassword = true;
      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeFalse();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeTrue();
    });

    it('should toggle hidePassword1', () => {
      component.hidePassword1 = true;
      component.togglePasswordVisibility1();
      expect(component.hidePassword1).toBeFalse();

      component.togglePasswordVisibility1();
      expect(component.hidePassword1).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      component.form.patchValue({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      component.onSubmit();

      expect(authService.registerTech).not.toHaveBeenCalled();
    });

    it('should not submit if already loading', () => {
      component.loading = true;
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(authService.registerTech).not.toHaveBeenCalled();
    });

    it('should show error if passwords do not match', () => {
      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password456!'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Las contraseñas no coinciden.');
      expect(authService.registerTech).not.toHaveBeenCalled();
    });

    it('should call registerTech with correct credentials', () => {
      authService.registerTech.and.returnValue(of('OK'));

      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(authService.registerTech).toHaveBeenCalledWith(
        'testuser',
        'test@test.com',
        'Password123!'
      );
    });

    it('should show success message on successful registration', () => {
      authService.registerTech.and.returnValue(of('OK'));

      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(component.successMessage).toBe('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
    });

    it('should reset form on successful registration', () => {
      authService.registerTech.and.returnValue(of('OK'));

      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(component.form.get('username')?.value).toBeNull();
      expect(component.form.get('email')?.value).toBeNull();
      expect(component.form.get('password')?.value).toBeNull();
      expect(component.form.get('confirmPassword')?.value).toBeNull();
    });

    it('should show error message if username already taken', () => {
      authService.registerTech.and.returnValue(of('USERNAME_TAKEN'));

      component.form.patchValue({
        username: 'existinguser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('El nombre de usuario ya está en uso.');
    });

    it('should handle registration error', () => {
      authService.registerTech.and.returnValue(throwError(() => new Error('Network error')));

      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(component.loading).toBeFalse();
    });

    it('should clear messages before new submission', () => {
      component.errorMessage = 'Previous error';
      component.successMessage = 'Previous success';
      authService.registerTech.and.returnValue(of('OK'));

      component.form.patchValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

      component.onSubmit();

      expect(component.errorMessage).toBeNull();
      expect(component.successMessage).not.toBeNull();
    });
  });
});
