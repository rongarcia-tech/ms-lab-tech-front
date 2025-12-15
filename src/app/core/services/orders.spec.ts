import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdersService } from './orders.service';
import { API_LABS_BASE_URL } from '../config/api.config';

describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllOrders should map content or return empty array', () => {
    const page = { content: [{ id: 1, code: 'O1' }] } as any;
    let res: any;
    service.getAllOrders().subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/orders`);
    expect(req.request.method).toBe('GET');
    req.flush(page);
    expect(res).toEqual(page.content);

    service.getAllOrders().subscribe(r => (res = r));
    const req2 = httpMock.expectOne(`${API_LABS_BASE_URL}/orders`);
    req2.flush({});
    expect(res).toEqual([]);
  });

  it('getOrderById should GET correct URL', () => {
    let res: any;
    service.getOrderById('9').subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/orders/9`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 9 });
    expect(res.id).toBe(9);
  });

  it('createOrder should POST and return response', () => {
    const body = { patient: 'p' } as any;
    let res: any;
    service.createOrder(body).subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 3 });
    expect(res.id).toBe(3);
  });

  it('assignLab should POST to assign endpoint', () => {
    const body = { labId: 'L1' } as any;
    let res: any;
    service.assignLab('2', body).subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/orders/2/assign`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 2 });
    expect(res.id).toBe(2);
  });

  it('start and finish should POST to correct endpoints', () => {
    let started = false;
    service.start('7').subscribe(() => (started = true));
    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/orders/7/start`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
    expect(started).toBeTrue();

    let finished = false;
    service.finish('7').subscribe(() => (finished = true));
    const req2 = httpMock.expectOne(`${API_LABS_BASE_URL}/orders/7/finish`);
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body).toEqual({});
    req2.flush({});
    expect(finished).toBeTrue();
  });
});
