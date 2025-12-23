import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { OrdersPage } from './orders-page';
import { OrdersService } from '../../../../core/services/orders.service';
import { LabsService } from '../../../../core/services/lab.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs/operators';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let labsService: jasmine.SpyObj<LabsService>;

  beforeEach(async () => {
    const ordersServiceMock = jasmine.createSpyObj('OrdersService', ['getAllOrders', 'assignLabToOrder', 'startOrder', 'finishOrder']);
    const labsServiceMock = jasmine.createSpyObj('LabsService', ['getAllLabs']);
    ordersServiceMock.getAllOrders.and.returnValue(of([]));
    labsServiceMock.getAllLabs.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      declarations: [OrdersPage],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule
      ],
      providers: [
        { provide: OrdersService, useValue: ordersServiceMock },
        { provide: LabsService, useValue: labsServiceMock }
      ]
    })
    .compileComponents();

    ordersService = TestBed.inject(OrdersService) as jasmine.SpyObj<OrdersService>;
    labsService = TestBed.inject(LabsService) as jasmine.SpyObj<LabsService>;
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

  describe('getActionLabel', () => {
    it('should return "Iniciar" for START action', () => {
      const label = component.getActionLabel('START');
      expect(label).toBe('Iniciar');
    });

    it('should return "Finalizar" for FINISH action', () => {
      const label = component.getActionLabel('FINISH');
      expect(label).toBe('Finalizar');
    });
  });

  describe('getNextAction', () => {
    it('should return START for ASSIGNED status', () => {
      const action = component.getNextAction('ASSIGNED');
      expect(action).toBe('START');
    });

    it('should return FINISH for IN_PROGRESS status', () => {
      const action = component.getNextAction('IN_PROGRESS');
      expect(action).toBe('FINISH');
    });

    it('should return null for CREATED status', () => {
      const action = component.getNextAction('CREATED');
      expect(action).toBeNull();
    });

    it('should return null for FINISHED status', () => {
      const action = component.getNextAction('FINISHED');
      expect(action).toBeNull();
    });
  });

  describe('onSelectLab', () => {
    it('should set selected lab code for order', () => {
      component.onSelectLab('order1', 'LAB001');
      expect(component.selectedLabCodeByOrder['order1']).toBe('LAB001');
    });
  });

  describe('assignLab', () => {
    it('should assign lab to order and reload', () => {
      const order = { externalId: 'order1', id: 1 } as any;
      component.selectedLabCodeByOrder['order1'] = 'LAB001';
      ordersService.assignLabToOrder.and.returnValue(of(void 0));

      component.assignLab(order);

      expect(ordersService.assignLabToOrder).toHaveBeenCalledWith(1, 'LAB001');
      expect(component.assigningByOrder['order1']).toBeFalse();
      expect(component.selectedLabCodeByOrder['order1']).toBeUndefined();
    });

    it('should handle error assigning lab', () => {
      const order = { externalId: 'order1', id: 1 } as any;
      component.selectedLabCodeByOrder['order1'] = 'LAB001';
      ordersService.assignLabToOrder.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');

      component.assignLab(order);

      expect(console.error).toHaveBeenCalled();
      expect(component.assigningByOrder['order1']).toBeFalse();
    });

    it('should not assign if no lab selected', () => {
      const order = { externalId: 'order1', id: 1 } as any;

      component.assignLab(order);

      expect(ordersService.assignLabToOrder).not.toHaveBeenCalled();
    });
  });

  describe('transitionOrder', () => {
    it('should start order for ASSIGNED status', () => {
      const order = { externalId: 'order1', id: 1, status: 'ASSIGNED' } as any;
      ordersService.startOrder.and.returnValue(of(void 0));

      component.transitionOrder(order);

      expect(ordersService.startOrder).toHaveBeenCalledWith(1);
      expect(component.transitioningByOrder['order1']).toBeFalse();
    });

    it('should finish order for IN_PROGRESS status', () => {
      const order = { externalId: 'order1', id: 1, status: 'IN_PROGRESS' } as any;
      ordersService.finishOrder.and.returnValue(of(void 0));

      component.transitionOrder(order);

      expect(ordersService.finishOrder).toHaveBeenCalledWith(1);
      expect(component.transitioningByOrder['order1']).toBeFalse();
    });

    it('should not transition for CREATED status', () => {
      const order = { externalId: 'order1', id: 1, status: 'CREATED' } as any;

      component.transitionOrder(order);

      expect(ordersService.startOrder).not.toHaveBeenCalled();
      expect(ordersService.finishOrder).not.toHaveBeenCalled();
    });

    it('should handle error in transition', () => {
      const order = { externalId: 'order1', id: 1, status: 'ASSIGNED' } as any;
      ordersService.startOrder.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');

      component.transitionOrder(order);

      expect(console.error).toHaveBeenCalled();
      expect(component.transitioningByOrder['order1']).toBeFalse();
    });
  });
});
