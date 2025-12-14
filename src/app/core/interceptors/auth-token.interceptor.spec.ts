import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { API_AUTH_BASE_URL, API_LABS_BASE_URL } from '../config/api.config';

describe('AuthTokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  const TOKEN_KEY = 'mslab_token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthTokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthTokenInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('intercept', () => {
    it('should add Authorization header with token for auth service requests', () => {
      const token = 'test-token-123';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get(`${API_AUTH_BASE_URL}/users`).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/users`);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });

    it('should add Authorization header with token for labs service requests', () => {
      const token = 'test-token-456';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get(`${API_LABS_BASE_URL}/labs`).subscribe();

      const req = httpMock.expectOne(`${API_LABS_BASE_URL}/labs`);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });

    it('should NOT add Authorization header for public auth login endpoint', () => {
      const token = 'test-token-789';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.post(`${API_AUTH_BASE_URL}/auth/login`, {}).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/auth/login`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should NOT add Authorization header for JWKS endpoint', () => {
      const token = 'test-token-jwks';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get(`${API_AUTH_BASE_URL}/.well-known/jwks.json`).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/.well-known/jwks.json`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should NOT add Authorization header for health check endpoint', () => {
      const token = 'test-token-health';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get(`${API_AUTH_BASE_URL}/actuator/health`).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/actuator/health`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should NOT add Authorization header if no token in localStorage', () => {
      httpClient.get(`${API_AUTH_BASE_URL}/users`).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/users`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should NOT intercept requests to external APIs', () => {
      const token = 'test-token-external';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get('https://external-api.com/data').subscribe();

      const req = httpMock.expectOne('https://external-api.com/data');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should NOT add Authorization header for swagger-ui endpoint', () => {
      const token = 'test-token-swagger';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get(`${API_AUTH_BASE_URL}/swagger-ui`).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/swagger-ui`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should NOT add Authorization header for api-docs endpoint', () => {
      const token = 'test-token-docs';
      localStorage.setItem(TOKEN_KEY, token);

      httpClient.get(`${API_AUTH_BASE_URL}/v3/api-docs`).subscribe();

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/v3/api-docs`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });
  });
});
