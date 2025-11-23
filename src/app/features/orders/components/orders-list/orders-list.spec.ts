import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersList } from './orders-list';

describe('OrdersList', () => {
  let component: OrdersList;
  let fixture: ComponentFixture<OrdersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
