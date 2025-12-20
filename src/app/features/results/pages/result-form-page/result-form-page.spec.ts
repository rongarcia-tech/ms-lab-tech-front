import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ResultFormPage } from './result-form-page';
import { ResultsService } from '../../../../core/services/results.service';

describe('ResultFormPage', () => {
  let component: ResultFormPage;
  let fixture: ComponentFixture<ResultFormPage>;

  let resultsService: jasmine.SpyObj<ResultsService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    const resultsServiceMock = jasmine.createSpyObj<ResultsService>('ResultsService', [
      'createResult',
      'updateResult',
      'getResultById',
    ]);

    const routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap({ id: null }),
        params: { id: null },
      },
      paramMap: of(convertToParamMap({ id: null })),
    };

    routerMock.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      declarations: [ResultFormPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ResultsService, useValue: resultsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    })
      // evita errores de Material (mat-select, etc.) en tests
      .overrideComponent(ResultFormPage, {
        set: { template: `<form [formGroup]="form"></form>` },
      })
      .compileComponents();

    resultsService = TestBed.inject(ResultsService) as jasmine.SpyObj<ResultsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  function createComponent() {
    fixture = TestBed.createComponent(ResultFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    createComponent();
    expect(component.form.get('orderExternalId')).toBeDefined();
    expect(component.form.get('patientId')).toBeDefined();
    expect(component.form.get('testCode')).toBeDefined();
    expect(component.form.get('testName')).toBeDefined();
    expect(component.form.get('status')).toBeDefined();
  });

  it('should be invalid when required fields are empty', () => {
    createComponent();
    component.form.patchValue({
      orderExternalId: '',
      patientId: '',
      testCode: '',
      testName: '',
    });
    expect(component.form.invalid).toBeTrue();
  });

  it('ngOnInit edit mode should load result', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: 'R1' });

    resultsService.getResultById.and.returnValue(
      of({
        externalId: 'R1',
        orderExternalId: 'O1',
        patientId: 'P1',
        testCode: 'PCR',
        testName: 'Proteína C Reactiva',
        valueText: 'Negativo',
        valueNumber: null,
        unit: null,
        referenceRange: '0-10',
        flag: 'NORMAL',
        status: 'PENDING',
      } as any)
    );

    createComponent();

    expect(resultsService.getResultById).toHaveBeenCalledWith('R1');
    expect(component.isEdit).toBeTrue();
    expect(component.form.get('orderExternalId')?.value).toBe('O1');
    expect(component.form.get('patientId')?.value).toBe('P1');
    expect(component.loading).toBeFalse();
  });

  it('ngOnInit edit mode should handle getResult error', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: 'R404' });
    resultsService.getResultById.and.returnValue(throwError(() => ({ status: 404 })));

    const errSpy = spyOn(console, 'error');

    createComponent();

    expect(errSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('submit should create result and navigate on success', () => {
    createComponent();

    component.form.patchValue({
      orderExternalId: 'O1',
      patientId: 'P1',
      testCode: 'PCR',
      testName: 'Proteína C Reactiva',
      valueText: 'Negativo',
      valueNumber: null,
      unit: '',
      referenceRange: '0-10',
      flag: 'NORMAL',
      status: 'PENDING',
    });

    resultsService.createResult.and.returnValue(of({} as any));

    component.submit();

    expect(resultsService.createResult).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/results']);
    expect(component.loading).toBeFalse();
  });

  it('submit should stop loading on create error', () => {
    createComponent();

    component.form.patchValue({
      orderExternalId: 'O1',
      patientId: 'P1',
      testCode: 'PCR',
      testName: 'Proteína C Reactiva',
      status: 'PENDING',
    });

    resultsService.createResult.and.returnValue(throwError(() => ({ status: 500 })));
    const errSpy = spyOn(console, 'error');

    component.submit();

    expect(errSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('submit should update result and navigate on success', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: 'R9' });

    resultsService.getResultById.and.returnValue(
      of({
        externalId: 'R9',
        orderExternalId: 'O9',
        patientId: 'P9',
        testCode: 'PCR',
        testName: 'Proteína C Reactiva',
        status: 'PENDING',
      } as any)
    );

    createComponent();

    component.form.patchValue({
      testCode: 'PCR',
      testName: 'PCR Actualizada',
      status: 'FINAL',
      valueText: 'Negativo',
    });

    resultsService.updateResult.and.returnValue(of({} as any));

    component.submit();

    expect(resultsService.updateResult).toHaveBeenCalledWith('R9', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/results']);
    expect(component.loading).toBeFalse();
  });

  it('submit should stop loading on update error', () => {
    activatedRouteMock.snapshot.paramMap = convertToParamMap({ id: 'R10' });

    resultsService.getResultById.and.returnValue(
      of({
        externalId: 'R10',
        orderExternalId: 'O10',
        patientId: 'P10',
        testCode: 'PCR',
        testName: 'Proteína C Reactiva',
        status: 'PENDING',
      } as any)
    );

    createComponent();

    component.form.patchValue({
      testCode: 'PCR',
      testName: 'PCR Actualizada',
      status: 'FINAL',
    });

    resultsService.updateResult.and.returnValue(throwError(() => ({ status: 500 })));
    const errSpy = spyOn(console, 'error');

    component.submit();

    expect(errSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
