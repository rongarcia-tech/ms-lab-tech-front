import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

describe('HttpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('intercept', () => {
    it('should handle successful responses without error', () => {
      httpClient.get('http://api.test.com/data').subscribe((data) => {
        expect(data).toEqual({ success: true });
        expect(authServiceMock.logout).not.toHaveBeenCalled();
        expect(routerMock.navigate).not.toHaveBeenCalled();
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush({ success: true });
    });

    it('should call logout and navigate to /login on 401 Unauthorized error', () => {
      httpClient.get('http://api.test.com/data').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not call logout on 404 Not Found error', () => {
      httpClient.get('http://api.test.com/data').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(authServiceMock.logout).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not call logout on 500 Server Error', () => {
      httpClient.get('http://api.test.com/data').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      expect(authServiceMock.logout).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should handle 403 Forbidden error without logout', () => {
      httpClient.get('http://api.test.com/data').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

      expect(authServiceMock.logout).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should handle 400 Bad Request error', () => {
      httpClient.get('http://api.test.com/data').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      expect(authServiceMock.logout).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should handle POST requests with 401 error', () => {
      httpClient.post('http://api.test.com/data', { test: 'data' }).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should throw error after handling it', () => {
      let receivedError: any;

      httpClient.get('http://api.test.com/data').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          receivedError = error;
        }
      });

      const req = httpMock.expectOne('http://api.test.com/data');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(receivedError).toBeDefined();
      expect(receivedError.status).toBe(401);
    });
  });
});
