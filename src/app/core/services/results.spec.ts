import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResultsService } from './results.service';
import { API_RESULTS_BASE_URL } from '../config/api.config';
import { LabResultResponse } from '../../shared/models/results.models';

describe('ResultsService', () => {
  let service: ResultsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ResultsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all results', () => {
    const mockResponse = { content: [{ id: 1, externalId: '1', orderExternalId: 'o1', patientId: 'p1', testCode: 'tc', testName: 'Result 1', valueText: null, valueNumber: null, unit: null, referenceRange: null, flag: null, status: 'PENDING' as const, createdAt: '2023-01-01', updatedAt: '2023-01-01' }] };
    service.getAllResults().subscribe(results => {
      expect(results).toEqual(mockResponse.content as LabResultResponse[]);
    });
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get results by order', () => {
    const mockResponse = { content: [{ id: 2, externalId: '2', orderExternalId: 'order1', patientId: 'p2', testCode: 'tc2', testName: 'Result 2', valueText: null, valueNumber: null, unit: null, referenceRange: null, flag: null, status: 'FINAL' as const, createdAt: '2023-01-01', updatedAt: '2023-01-01' }] };
    service.getResultsByOrder('order1').subscribe(results => {
      expect(results).toEqual(mockResponse.content as LabResultResponse[]);
    });
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results?orderExternalId=order1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get result by id', () => {
    const mockResult: LabResultResponse = { id: 3, externalId: '3', orderExternalId: 'o3', patientId: 'p3', testCode: 'tc3', testName: 'Result 3', valueText: null, valueNumber: null, unit: null, referenceRange: null, flag: null, status: 'CANCELLED' as const, createdAt: '2023-01-01', updatedAt: '2023-01-01' };
    service.getResultById('3').subscribe(result => {
      expect(result).toEqual(mockResult);
    });
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results/3`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('should create result', () => {
    const mockRequest = { orderExternalId: 'o1', patientId: 'p1', labCode: 'L1', requestedTest: 'rt', testName: 'tn', testCode: 'tc' };
    const mockResponse: LabResultResponse = { id: 4, externalId: '4', orderExternalId: 'o1', patientId: 'p1', testCode: 'tc', testName: 'tn', valueText: null, valueNumber: null, unit: null, referenceRange: null, flag: null, status: 'PENDING' as const, createdAt: '2023-01-01', updatedAt: '2023-01-01' };
    service.createResult(mockRequest).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should update result', () => {
    const mockRequest = { testName: 'Updated Result', valueText: 'val' };
    const mockResponse: LabResultResponse = { id: 5, externalId: '5', orderExternalId: 'o5', patientId: 'p5', testCode: 'tc5', testName: 'Updated Result', valueText: 'val', valueNumber: null, unit: null, referenceRange: null, flag: null, status: 'FINAL' as const, createdAt: '2023-01-01', updatedAt: '2023-01-01' };
    service.updateResult('5', mockRequest).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should delete result', () => {
    service.deleteResult('1').subscribe();
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get my results', () => {
    const mockResponse = { content: [{ id: 6, externalId: '6', orderExternalId: 'o6', patientId: 'p6', testCode: 'tc6', testName: 'My Result', valueText: null, valueNumber: null, unit: null, referenceRange: null, flag: null, status: 'PENDING' as const, createdAt: '2023-01-01', updatedAt: '2023-01-01' }] };
    service.getMyResults().subscribe(results => {
      expect(results).toEqual(mockResponse.content as LabResultResponse[]);
    });
    const req = httpMock.expectOne(`${API_RESULTS_BASE_URL}/results/my`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});