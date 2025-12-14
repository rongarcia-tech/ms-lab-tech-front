import { TestBed } from '@angular/core/testing';
import { OrdersModule } from './orders-module';

describe('OrdersModule', () => {
  let module: OrdersModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrdersModule]
    });
    module = TestBed.inject(OrdersModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
