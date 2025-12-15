import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LabFormPage } from './lab-form-page';
import { LabsService } from '../../../../core/services/lab.service';
import { of, throwError } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('LabFormPage', () => {
  let component: LabFormPage;
  let fixture: ComponentFixture<LabFormPage>;
  let labsService: jasmine.SpyObj<LabsService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    // ✅ incluye TODOS los métodos que uses en tests o en ngOnInit/template
    const labsServiceMock = jasmine.createSpyObj('LabsService', [
      'createLab',
      'updateLab',
      'getLabById',
      'getAllLabs', // ✅ ESTE faltaba (tu error)
    ]);

    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // ✅ stubs por defecto seguros
    labsServiceMock.getAllLabs.and.returnValue(of([]));
    labsServiceMock.getLabById.and.returnValue(
      of({
        id: 1,
        code: 'LAB001',
        name: 'Test Lab',
        address: '123 Main St',
        phone: '+1234567890',
        externalId: 'ext-1',
        active: true,
        supportedTests: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      })
    );

    routerMock.navigate.and.resolveTo(true);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (_key: string) => null, // por defecto: create mode
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [LabFormPage],
      imports: [
        ReactiveFormsModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: LabsService, useValue: labsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    labsService = TestBed.inject(LabsService) as jasmine.SpyObj<LabsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(LabFormPage);
    component = fixture.componentInstance;

    // ⚠️ NO hacemos detectChanges aquí si en tus tests llamas ngOnInit() manualmente.
    // Si prefieres que Angular llame ngOnInit automáticamente, entonces descomenta:
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - Create mode', () => {
    it('should initialize form in create mode', () => {
      component.ngOnInit();

      expect(component.form).toBeDefined();
      expect(component.isEdit).toBeFalse();
      expect(component.id).toBeNull();
      expect(component.loading).toBeFalse();
    });

    it('should initialize form with required fields', () => {
      component.ngOnInit();

      expect(component.form.get('code')).toBeDefined();
      expect(component.form.get('name')).toBeDefined();
      expect(component.form.get('address')).toBeDefined();
      expect(component.form.get('phone')).toBeDefined();
      expect(component.form.get('supportedTests')).toBeDefined();
    });

    it('should have invalid form when required fields are empty', () => {
      component.ngOnInit();

      component.form.patchValue({
        code: '',
        name: '',
        address: '',
        phone: '',
      });

      expect(component.form.invalid).toBeTrue();
    });

    it('should have valid form when required fields are filled', () => {
      component.ngOnInit();

      component.form.patchValue({
        code: 'LAB001',
        name: 'Test Lab',
        address: '123 Main St',
        phone: '+1234567890',
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should allow supportedTests field in create mode', () => {
      component.ngOnInit();

      const supportedTestsControl = component.form.get('supportedTests');
      expect(supportedTestsControl?.enabled).toBeTrue();
    });
  });

  describe('ngOnInit - Edit mode', () => {
    it('should load existing lab in edit mode', () => {
      const mockLab = {
        id: 1,
        code: 'LAB001',
        name: 'Test Lab',
        address: '123 Main St',
        phone: '+1234567890',
        externalId: 'ext-1',
        active: true,
        supportedTests: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      activatedRoute.snapshot.paramMap.get = jasmine.createSpy().and.returnValue('1');
      labsService.getLabById.and.returnValue(of(mockLab));

      component.ngOnInit();

      expect(component.isEdit).toBeTrue();
      expect(component.id).toBe('1');
    });

    it('should disable code field in edit mode', () => {
      const mockLab = {
        id: 1,
        code: 'LAB001',
        name: 'Test Lab',
        address: '123 Main St',
        phone: '+1234567890',
        externalId: 'ext-1',
        active: true,
        supportedTests: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      activatedRoute.snapshot.paramMap.get = jasmine.createSpy().and.returnValue('1');
      labsService.getLabById.and.returnValue(of(mockLab));

      component.ngOnInit();

      expect(component.form.get('code')?.disabled).toBeTrue();
    });

    it('should handle error loading lab', () => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy().and.returnValue('1');
      labsService.getLabById.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('should create lab, parse supportedTests and navigate on success', () => {
      component.ngOnInit();

      component.form.patchValue({
        code: 'LABX',
        name: 'Lab X',
        address: 'Addr',
        phone: '123',
        supportedTests: 't1, t2, ,t3'
      });

      labsService.createLab.and.returnValue(of({} as any));

      component.submit();

      expect(labsService.createLab).toHaveBeenCalledWith(jasmine.objectContaining({
        code: 'LABX',
        supportedTests: ['t1', 't2', 't3']
      }));
      expect(router.navigate).toHaveBeenCalledWith(['/labs']);
      expect(component.loading).toBeFalse();
    });

    it('should log and stop loading on create error', () => {
      component.ngOnInit();

      component.form.patchValue({
        code: 'LABX',
        name: 'Lab X',
        address: 'Addr',
        phone: '123',
        supportedTests: ''
      });

      labsService.createLab.and.returnValue(throwError(() => ({ status: 500 })));
      const errSpy = spyOn(console, 'error');

      component.submit();

      expect(errSpy).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should update lab and navigate on success', () => {
      // prepare edit mode
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy().and.returnValue('10');
      labsService.getLabById.and.returnValue(of({ id: 10, code: 'C10', name: 'N', address: 'A', phone: 'P' } as any));

      component.ngOnInit();

      component.form.patchValue({
        name: 'Updated',
        address: 'New Addr',
        phone: '999'
      });

      labsService.updateLab.and.returnValue(of({} as any));

      component.submit();

      expect(labsService.updateLab).toHaveBeenCalledWith('10', jasmine.objectContaining({
        name: 'Updated'
      }));
      expect(router.navigate).toHaveBeenCalledWith(['/labs']);
      expect(component.loading).toBeFalse();
    });

    it('should log and stop loading on update error', () => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy().and.returnValue('11');
      labsService.getLabById.and.returnValue(of({ id: 11, code: 'C11', name: 'N', address: 'A', phone: 'P' } as any));

      component.ngOnInit();

      component.form.patchValue({ name: 'X', address: 'A', phone: 'P' });

      labsService.updateLab.and.returnValue(throwError(() => ({ status: 500 })));
      const errSpy = spyOn(console, 'error');

      component.submit();

      expect(errSpy).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should not call service when form invalid', () => {
      component.ngOnInit();

      component.form.patchValue({ code: '', name: '', address: '', phone: '' });

      labsService.createLab.calls.reset();
      component.submit();

      expect(labsService.createLab).not.toHaveBeenCalled();
    });
  });
});
