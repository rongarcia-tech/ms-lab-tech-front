import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LabsService } from './lab.service';
import { API_LABS_BASE_URL } from '../config/api.config';

describe('LabsService', () => {
  let service: LabsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(LabsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllLabs should map content or return empty array', () => {
    const mockPage = { content: [{ id: 1, code: 'C1' }] } as any;

    let result: any[] | undefined;
    service.getAllLabs().subscribe(r => (result = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);

    expect(result).toEqual(mockPage.content);

    // now when content is undefined
    service.getAllLabs().subscribe(r => (result = r));
    const req2 = httpMock.expectOne(`${API_LABS_BASE_URL}/labs`);
    req2.flush({});
    expect(result).toEqual([]);
  });

  it('getLabById should call correct URL', () => {
    let res: any;
    service.getLabById('5').subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs/5`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 5, code: 'C5' });

    expect(res.id).toBe(5);
  });

  it('createLab should POST and return value', () => {
    const body = { code: 'X' } as any;
    let res: any;
    service.createLab(body).subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 9, code: 'X' });

    expect(res.id).toBe(9);
  });

  it('updateLab should PUT and return value', () => {
    const body = { name: 'New' } as any;
    let res: any;
    service.updateLab('7', body).subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 7 });

    expect(res.id).toBe(7);
  });

  it('deactivateLab should POST to deactivate endpoint', () => {
    let called = false;
    service.deactivateLab('3').subscribe(() => (called = true));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs/3/deactivate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);

    expect(called).toBeTrue();
  });

  it('activateLab should POST to activate endpoint', () => {
    let called = false;
    service.activateLab('4').subscribe(() => (called = true));

    const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs/4/activate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);

    expect(called).toBeTrue();
  });
});
