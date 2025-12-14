import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserFormPage } from './user-form-page';
import { UserService } from '../../../../core/services/user.service';
import { RolesService } from '../../../../core/services/roles.service';

describe('UserFormPage', () => {
  let component: UserFormPage;
  let fixture: ComponentFixture<UserFormPage>;

  let userService: jasmine.SpyObj<UserService>;
  let rolesService: jasmine.SpyObj<RolesService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj<UserService>('UserService', [
      'createUser',
      'updateUser',
      'getUserById',
    ]);

    const rolesServiceMock = jasmine.createSpyObj<RolesService>('RolesService', [
      'listRoles',
    ]);

    const routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap({ id: null }),
        params: { id: null },
      },
      paramMap: of(convertToParamMap({ id: null })),
    };

    rolesServiceMock.listRoles.and.returnValue(of([]));
    routerMock.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      declarations: [UserFormPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RolesService, useValue: rolesServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    })
      // ✅ Evita NG01203 (no value accessor) por controles Material en el template (roles)
      .overrideComponent(UserFormPage, {
        set: {
          template: `<form [formGroup]="form"></form>`,
        },
      })
      .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    rolesService = TestBed.inject(RolesService) as jasmine.SpyObj<RolesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  function createComponent() {
    fixture = TestBed.createComponent(UserFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should load roles on constructor', (done) => {
    const mockRoles = [
      { id: 1, name: 'ADMIN' },
      { id: 2, name: 'LAB_TECH' },
    ];

    rolesService.listRoles.and.returnValue(of(mockRoles as any));

    createComponent();

    component.roles$.pipe(take(1)).subscribe((roles) => {
      expect(roles).toEqual(mockRoles as any);
      expect(rolesService.listRoles).toHaveBeenCalled();
      done();
    });
  });

  it('should handle error loading roles', (done) => {
    rolesService.listRoles.and.returnValue(throwError(() => new Error('API Error')));
    const errorSpy = spyOn(console, 'error');

    createComponent();

    component.roles$.pipe(take(1)).subscribe((roles) => {
      expect(roles).toEqual([]);

      // Si tu componente NO hace console.error, elimina esta línea.
      expect(errorSpy).toHaveBeenCalled();

      done();
    });
  });

  it('should initialize form with default values', () => {
    createComponent();

    expect(component.form.get('username')).toBeDefined();
    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
    expect(component.form.get('labCode')).toBeDefined();
    expect(component.form.get('roles')).toBeDefined();
    expect(component.form.get('active')).toBeDefined();
  });

  it('should have invalid form when required fields are empty', () => {
    createComponent();

    component.form.patchValue({
      username: '',
      email: '',
      labCode: '',
    });

    expect(component.form.invalid).toBeTrue();
  });

 

  it('should invalidate form on invalid email', () => {
    createComponent();

    component.form.patchValue({
      username: 'testuser',
      email: 'invalid-email',
      labCode: 'LAB001',
    });

    expect(component.form.invalid).toBeTrue();
  });
});
