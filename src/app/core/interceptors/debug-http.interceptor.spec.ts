import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugHttpInterceptor } from './debug-http.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('DebugHttpInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let consoleLogSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DebugHttpInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DebugHttpInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    consoleLogSpy = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('intercept', () => {
    it('should log outgoing HTTP request without Authorization header', () => {
      httpClient.get('http://api.test.com/data').subscribe();

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush({});

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[HTTP OUT]',
        'GET',
        'http://api.test.com/data',
        'AUTH=NO'
      );
    });

    it('should log outgoing HTTP request with Authorization header', () => {
      const req = httpClient.get('http://api.test.com/data', {
        headers: { 'Authorization': 'Bearer token' }
      });
      req.subscribe();

      const httpReq = httpMock.expectOne('http://api.test.com/data');
      httpReq.flush({});

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[HTTP OUT]',
        'GET',
        'http://api.test.com/data',
        'AUTH=YES'
      );
    });

    it('should log incoming HTTP response', () => {
      httpClient.get('http://api.test.com/data').subscribe();

      const req = httpMock.expectOne('http://api.test.com/data');
      const mockData = { id: 1, name: 'Test' };
      req.flush(mockData);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[HTTP IN ]',
        'GET',
        'http://api.test.com/data',
        'status=',
        200,
        'body=',
        mockData
      );
    });

    it('should log HTTP error', () => {
      httpClient.get('http://api.test.com/data').subscribe({
        next: () => {},
        error: () => {}
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      const errorEvent = new ProgressEvent('error');
      req.error(errorEvent, { status: 500, statusText: 'Internal Server Error' });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[HTTP ERR]',
        'GET',
        'http://api.test.com/data',
        'status=',
        jasmine.any(Number),
        'err=',
        jasmine.any(Object)
      );
    });

    it('should handle POST requests', () => {
      httpClient.post('http://api.test.com/data', { test: 'data' }).subscribe();

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush({ success: true });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[HTTP OUT]',
        'POST',
        'http://api.test.com/data',
        'AUTH=NO'
      );
    });

    it('should handle PUT requests', () => {
      httpClient.put('http://api.test.com/data/1', { test: 'data' }).subscribe();

      const req = httpMock.expectOne('http://api.test.com/data/1');
      req.flush({ success: true });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[HTTP OUT]',
        'PUT',
        'http://api.test.com/data/1',
        'AUTH=NO'
      );
    });

    it('should handle DELETE requests', () => {
      httpClient.delete('http://api.test.com/data/1').subscribe();

      const req = httpMock.expectOne('http://api.test.com/data/1');
      req.flush({});

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[HTTP OUT]',
        'DELETE',
        'http://api.test.com/data/1',
        'AUTH=NO'
      );
    });
  });
});
