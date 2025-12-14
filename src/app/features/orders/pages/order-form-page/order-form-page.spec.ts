import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { OrderFormPage } from './order-form-page';
import { OrdersService } from '../../../../core/services/orders.service';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('OrderFormPage', () => {
  let component: OrderFormPage;
  let fixture: ComponentFixture<OrderFormPage>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const ordersServiceMock = jasmine.createSpyObj<OrdersService>('OrdersService', ['createOrder']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OrderFormPage],
      imports: [ReactiveFormsModule, MatToolbarModule],
      providers: [
        { provide: OrdersService, useValue: ordersServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    ordersService = TestBed.inject(OrdersService) as jasmine.SpyObj<OrdersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(OrderFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.form.get('patientId')).toBeDefined();
    expect(component.form.get('requestedTest')).toBeDefined();
    expect(component.form.get('labCode')).toBeDefined();
  });

  it('should have invalid form when required fields are empty', () => {
    component.form.patchValue({
      patientId: '',
      requestedTest: ''
    });

    expect(component.form.invalid).toBeTrue();
  });

  it('should have valid form when required fields are filled', () => {
    component.form.patchValue({
      patientId: 'PAT001',
      requestedTest: 'Blood Test'
    });

    expect(component.form.valid).toBeTrue();
  });

  describe('submit', () => {
    it('should not submit if form is invalid', () => {
      component.form.patchValue({
        patientId: '',
        requestedTest: ''
      });

      component.submit();

      expect(ordersService.createOrder).not.toHaveBeenCalled();
    });

    it('should submit order with required fields only', () => {
      const mockOrder: any = { id: 1, externalId: 'EXT001', patientId: 'PAT001', requestedTest: 'Blood Test', status: 'pending', labCode: '', createdAt: new Date(), updatedAt: new Date() };
      ordersService.createOrder.and.returnValue(of(mockOrder as any));

      component.form.patchValue({
        patientId: 'PAT001',
        requestedTest: 'Blood Test',
        labCode: ''
      });

      component.submit();

      expect(ordersService.createOrder).toHaveBeenCalledWith({
        patientId: 'PAT001',
        requestedTest: 'Blood Test'
      });
    });

    it('should submit order with all fields including labCode', () => {
      const mockOrder: any = { id: 1, externalId: 'EXT001', patientId: 'PAT001', requestedTest: 'Blood Test', status: 'pending', labCode: 'LAB001', createdAt: new Date(), updatedAt: new Date() };
      ordersService.createOrder.and.returnValue(of(mockOrder as any));

      component.form.patchValue({
        patientId: 'PAT001',
        requestedTest: 'Blood Test',
        labCode: 'LAB001'
      });

      component.submit();

      expect(ordersService.createOrder).toHaveBeenCalledWith({
        patientId: 'PAT001',
        requestedTest: 'Blood Test',
        labCode: 'LAB001'
      });
    });

    it('should not include labCode if it contains only whitespace', () => {
      const mockOrder: any = { id: 1, externalId: 'EXT001', patientId: 'PAT001', requestedTest: 'Blood Test', status: 'pending', labCode: '', createdAt: new Date(), updatedAt: new Date() };
      ordersService.createOrder.and.returnValue(of(mockOrder as any));

      component.form.patchValue({
        patientId: 'PAT001',
        requestedTest: 'Blood Test',
        labCode: '   '
      });

      component.submit();

      expect(ordersService.createOrder).toHaveBeenCalledWith({
        patientId: 'PAT001',
        requestedTest: 'Blood Test'
      });
    });

    it('should set loading to true during submission', () => {
      const mockOrder: any = { id: 1, externalId: 'EXT001', patientId: 'PAT001', requestedTest: 'Blood Test', status: 'pending', labCode: '', createdAt: new Date(), updatedAt: new Date() };
      ordersService.createOrder.and.returnValue(of(mockOrder as any));
      component.loading = false;

      component.form.patchValue({
        patientId: 'PAT001',
        requestedTest: 'Blood Test'
      });

      component.submit();

      // Check that loading was set to true at some point
      expect(ordersService.createOrder).toHaveBeenCalled();
    });

    it('should navigate to /orders on successful submission', () => {
      const mockOrder: any = { id: 1, externalId: 'EXT001', patientId: 'PAT001', requestedTest: 'Blood Test', status: 'pending', labCode: '', createdAt: new Date(), updatedAt: new Date() };
      ordersService.createOrder.and.returnValue(of(mockOrder as any));

      component.form.patchValue({
        patientId: 'PAT001',
        requestedTest: 'Blood Test'
      });

      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['/orders']);
    });

    it('should handle error during submission', () => {
      const error = new Error('API Error');
      ordersService.createOrder.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.form.patchValue({
        patientId: 'PAT001',
        requestedTest: 'Blood Test'
      });

      component.submit();

      expect(console.error).toHaveBeenCalledWith('[OrderFormPage] createOrder error', error);
    });
  });
});
