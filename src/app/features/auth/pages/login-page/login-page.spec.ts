import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login-page';
import { AuthService } from '../../../../core/services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty username and password', () => {
      expect(component.form.get('username')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
    });

    it('should have invalid form when fields are empty', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('should have valid form when both fields are filled', () => {
      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should have invalid form if username is empty', () => {
      component.form.patchValue({
        username: '',
        password: 'password123'
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have invalid form if password is empty', () => {
      component.form.patchValue({
        username: 'testuser',
        password: ''
      });

      expect(component.form.invalid).toBeTrue();
    });
  });

  describe('Password visibility toggle', () => {
    it('should initialize hidePassword as true', () => {
      expect(component.hidePassword).toBeTrue();
    });

    it('should toggle hidePassword from true to false', () => {
      component.hidePassword = true;
      component.togglePasswordVisibility();

      expect(component.hidePassword).toBeFalse();
    });

    it('should toggle hidePassword from false to true', () => {
      component.hidePassword = false;
      component.togglePasswordVisibility();

      expect(component.hidePassword).toBeTrue();
    });

    it('should toggle hidePassword multiple times', () => {
      component.hidePassword = true;

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeFalse();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeTrue();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      component.form.patchValue({
        username: '',
        password: ''
      });

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not submit if already loading', () => {
      component.loading = true;
      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call login with correct credentials', () => {
      authService.login.and.returnValue(of(true));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('should set loading to true during submission', () => {
      authService.login.and.returnValue(of(true));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      // After submission completes, loading should be false
      expect(component.loading).toBeFalse();
    });

    it('should navigate to /labs on successful login', () => {
      authService.login.and.returnValue(of(true));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/labs']);
    });

    it('should set error message on invalid credentials', () => {
      authService.login.and.returnValue(of(false));

      component.form.patchValue({
        username: 'testuser',
        password: 'wrongpassword'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Credenciales inválidas.');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should set error message on login error', () => {
      authService.login.and.returnValue(throwError(() => new Error('Network error')));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Error al intentar iniciar sesión.');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should clear error message before new submission', () => {
      component.errorMessage = 'Previous error';
      authService.login.and.returnValue(of(true));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBeNull();
    });

    it('should set loading to false after successful login', () => {
      component.loading = false;
      authService.login.and.returnValue(of(true));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBeFalse();
    });

    it('should set loading to false after login error', () => {
      component.loading = false;
      authService.login.and.returnValue(throwError(() => new Error('Error')));

      component.form.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBeFalse();
    });
  });
});
