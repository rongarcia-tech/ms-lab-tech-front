import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserFormPage } from './user-form-page';
import { UserService } from '../../../../core/services/user.service';
import { RolesService } from '../../../../core/services/roles.service';
import { LabsService } from '../../../../core/services/lab.service';

describe('UserFormPage', () => {
  let component: UserFormPage;
  let fixture: ComponentFixture<UserFormPage>;

  let userService: jasmine.SpyObj<UserService>;
  let rolesService: jasmine.SpyObj<RolesService>;
  let labsService: jasmine.SpyObj<LabsService>;
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

    const labsServiceMock = jasmine.createSpyObj<LabsService>('LabsService', [
      'getAllLabs',
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
    labsServiceMock.getAllLabs.and.returnValue(of([]));
    routerMock.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      declarations: [UserFormPage],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RolesService, useValue: rolesServiceMock },
        { provide: LabsService, useValue: labsServiceMock },
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
    labsService = TestBed.inject(LabsService) as jasmine.SpyObj<LabsService>;
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

  it('ngOnInit edit mode should load user and disable password', () => {
    // prepare route to have id
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: '1' });
    userService.getUserById.and.returnValue(of({ id: 1, username: 'u1', email: 'e1', labCode: 'L1', roles: ['ADMIN'], active: true } as any));

    createComponent();

    expect(userService.getUserById).toHaveBeenCalledWith('1');
    expect(component.form.get('username')?.value).toBe('u1');
    expect(component.form.get('email')?.value).toBe('e1');
    expect(component.form.get('labCode')?.value).toBe('L1');
    expect(component.form.get('roles')?.value).toEqual(['ADMIN']);
    expect(component.form.get('active')?.value).toBeTrue();
    expect(component.form.controls['password'].disabled).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('ngOnInit edit mode should handle getUser error', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: '2' });
    userService.getUserById.and.returnValue(throwError(() => ({ status: 404 })));
    const errSpy = spyOn(console, 'error');

    createComponent();

    expect(errSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('submit should create user and navigate on success', () => {
    createComponent();

    component.form.patchValue({
      username: 'cuser',
      email: 'c@e.com',
      password: 'password123',
      labCode: 'L1',
      roles: ['LAB_TECH'],
      active: true,
    });

    userService.createUser.and.returnValue(of({} as any));

    component.submit();

    expect(userService.createUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
    expect(component.loading).toBeFalse();
  });

  it('submit should log and stop loading on create error', () => {
    createComponent();

    component.form.patchValue({
      username: 'cuser',
      email: 'c@e.com',
      password: 'password123',
      labCode: 'L1',
      roles: ['LAB_TECH'],
      active: true,
    });

    userService.createUser.and.returnValue(throwError(() => ({ status: 500 })));
    const errSpy = spyOn(console, 'error');

    component.submit();

    expect(errSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('submit should update user and navigate on success', () => {
    // prepare edit mode
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: '5' });
    userService.getUserById.and.returnValue(of({ id: 5, username: 'u5', email: 'e5', labCode: 'L5', roles: ['LAB_TECH'], active: false } as any));

    createComponent();

    component.form.patchValue({
      email: 'updated@e.com',
      labCode: 'L5',
      roles: ['LAB_TECH'],
      active: true,
    });

    userService.updateUser.and.returnValue(of({} as any));

    component.submit();

    expect(userService.updateUser).toHaveBeenCalledWith('5', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
    expect(component.loading).toBeFalse();
  });

  it('submit should log and stop loading on update error', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: '6' });
    userService.getUserById.and.returnValue(of({ id: 6, username: 'u6', email: 'e6', labCode: 'L6' } as any));
    createComponent();

    component.form.patchValue({
      email: 'updated@e.com',
      labCode: 'L6',
      roles: ['LAB_TECH'],
      active: true,
    });

    userService.updateUser.and.returnValue(throwError(() => ({ status: 500 })));
    const errSpy = spyOn(console, 'error');

    component.submit();

    expect(errSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('submit should not call service when form invalid', () => {
    createComponent();
    component.form.patchValue({ username: '', email: '', labCode: '' });

    userService.createUser.calls.reset();
    component.submit();

    expect(userService.createUser).not.toHaveBeenCalled();
  });
});
