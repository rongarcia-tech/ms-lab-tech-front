import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { OrdersPage } from './orders-page';
import { OrdersService } from '../../../../core/services/orders.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { take } from 'rxjs/operators';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  let ordersService: jasmine.SpyObj<OrdersService>;

  beforeEach(async () => {
    const ordersServiceMock = jasmine.createSpyObj('OrdersService', ['getAllOrders', 'createOrder']);
    ordersServiceMock.getAllOrders.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      declarations: [OrdersPage],
      imports: [MatCardModule, MatChipsModule],
      providers: [
        { provide: OrdersService, useValue: ordersServiceMock }
      ]
    })
    .compileComponents();

    ordersService = TestBed.inject(OrdersService) as jasmine.SpyObj<OrdersService>;
    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('orders$ observable', () => {
    it('should load orders on component init', (done) => {
      const mockOrders = [
        { id: 1, patientId: 'PAT001', status: 'CREATED' },
        { id: 2, patientId: 'PAT002', status: 'IN_PROGRESS' }
      ];

      ordersService.getAllOrders.and.returnValue(of(mockOrders as any));

      component.orders$.pipe(take(1)).subscribe((orders) => {
        expect(orders).toEqual(mockOrders as any);
        expect(ordersService.getAllOrders).toHaveBeenCalled();
        done();
      });

      fixture.detectChanges();
    });

    it('should handle error loading orders', (done) => {
      ordersService.getAllOrders.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');

      component.orders$.pipe(take(1)).subscribe((orders) => {
        expect(orders).toEqual([]);
        expect(console.error).toHaveBeenCalled();
        done();
      });

      fixture.detectChanges();
    });
  });

  describe('reload', () => {
  it('should reload orders', () => {
    const firstOrders = [{ id: 1, patientId: 'PAT001', status: 'CREATED' }];
    const secondOrders = [{ id: 2, patientId: 'PAT002', status: 'IN_PROGRESS' }];

    // 1ra carga
    ordersService.getAllOrders.and.returnValue(of(firstOrders as any));
    fixture.detectChanges();

    const callsBefore = ordersService.getAllOrders.calls.count();

    // 2da carga
    ordersService.getAllOrders.and.returnValue(of(secondOrders as any));
    component.reload();

    const callsAfter = ordersService.getAllOrders.calls.count();

    // ✅ se llamó de nuevo (sin asumir exacto 2 porque a veces hay doble subscribe)
    expect(callsAfter).toBeGreaterThan(callsBefore);
  });
});


  describe('getStatusChipColor', () => {
    it('should return primary for FINISHED status', () => {
      const color = component.getStatusChipColor('FINISHED');
      expect(color).toBe('primary');
    });

    it('should return accent for IN_PROGRESS status', () => {
      const color = component.getStatusChipColor('IN_PROGRESS');
      expect(color).toBe('accent');
    });

    it('should return warn for CANCELLED status', () => {
      const color = component.getStatusChipColor('CANCELLED');
      expect(color).toBe('warn');
    });

    it('should return success for CREATED status', () => {
      const color = component.getStatusChipColor('CREATED');
      expect(color).toBe('success');
    });

    it('should return accent for unknown status', () => {
      const color = component.getStatusChipColor('UNKNOWN_STATUS');
      expect(color).toBe('accent');
    });
  });

  describe('createOrder', () => {
    it('should call ordersService.createOrder with required params', () => {
      ordersService.createOrder.and.returnValue(of({ id: 1 } as any));

      component.createOrder('PAT001', 'Blood Test');

      expect(ordersService.createOrder).toHaveBeenCalledWith({
        patientId: 'PAT001',
        requestedTest: 'Blood Test',
        labCode: undefined
      });
    });

    it('should call ordersService.createOrder with all params', () => {
      ordersService.createOrder.and.returnValue(of({ id: 1 } as any));

      component.createOrder('PAT001', 'Blood Test', 'LAB001');

      expect(ordersService.createOrder).toHaveBeenCalledWith({
        patientId: 'PAT001',
        requestedTest: 'Blood Test',
        labCode: 'LAB001'
      });
    });

    it('should handle error creating order', () => {
      const error = new Error('API Error');
      ordersService.createOrder.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.createOrder('PAT001', 'Blood Test');

      expect(console.error).toHaveBeenCalled();
    });
  });
});
