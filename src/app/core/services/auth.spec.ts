import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const AUTH_BASE = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should store token and current user when getMe succeeds', done => {
    spyOn(localStorage, 'setItem').and.callThrough();

    service.login('u', 'p').subscribe(res => {
      expect(res).toBeTrue();
      expect(localStorage.setItem).toHaveBeenCalledWith('mslab_token', 'tok-123');
      const raw = localStorage.getItem('mslab_current_user');
      expect(raw).toBeTruthy();
      const user = JSON.parse(raw as string);
      expect(user.username).toBe('u');
      done();
    });

    const reqLogin = httpMock.expectOne(`${AUTH_BASE}/auth/login`);
    expect(reqLogin.request.method).toBe('POST');
    reqLogin.flush({ token: 'tok-123' });

    const reqMe = httpMock.expectOne(`${AUTH_BASE}/users/me`);
    expect(reqMe.request.method).toBe('GET');
    reqMe.flush({ id: 1, username: 'u' });
  });

  it('login should succeed when getMe fails (still returns true)', done => {
    spyOn(localStorage, 'setItem').and.callThrough();

    service.login('u2', 'p2').subscribe(res => {
      expect(res).toBeTrue();
      expect(localStorage.getItem('mslab_token')).toBe('tok-err');
      expect(localStorage.getItem('mslab_current_user')).toBeNull();
      done();
    });

    const reqLogin = httpMock.expectOne(`${AUTH_BASE}/auth/login`);
    reqLogin.flush({ token: 'tok-err' });

    const reqMe = httpMock.expectOne(`${AUTH_BASE}/users/me`);
    reqMe.flush({ message: 'oops' }, { status: 500, statusText: 'Server Error' });
  });

  it('registerTech should return OK on success', done => {
    service.registerTech('a', 'a@a.com', 'p').subscribe(res => {
      expect(res).toBe('OK');
      done();
    });

    const req = httpMock.expectOne(`${AUTH_BASE}/users`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('registerTech should return USERNAME_TAKEN for 409', done => {
    service.registerTech('a', 'a@a.com', 'p').subscribe(res => {
      expect(res).toBe('USERNAME_TAKEN');
      done();
    });

    const req = httpMock.expectOne(`${AUTH_BASE}/users`);
    req.flush({}, { status: 409, statusText: 'Conflict' });
  });

  it('registerTech should return USERNAME_TAKEN for message containing username exist', done => {
    service.registerTech('a', 'a@a.com', 'p').subscribe(res => {
      expect(res).toBe('USERNAME_TAKEN');
      done();
    });

    const req = httpMock.expectOne(`${AUTH_BASE}/users`);
    req.flush({ message: 'Username already exists' }, { status: 400, statusText: 'Bad Request' });
  });

  it('registerTech should throw error for other failures', done => {
    service.registerTech('a', 'a@a.com', 'p').subscribe({
      next: () => fail('should not succeed'),
      error: err => {
        expect(err.status).toBe(500);
        done();
      }
    });

    const req = httpMock.expectOne(`${AUTH_BASE}/users`);
    req.flush({ message: 'server' }, { status: 500, statusText: 'Server Error' });
  });

  it('getCurrentUser should return parsed object or null on invalid json', () => {
    localStorage.setItem('mslab_current_user', JSON.stringify({ id: 2, username: 'x' }));
    expect(service.getCurrentUser()).toEqual({ id: 2, username: 'x' } as any);

    localStorage.setItem('mslab_current_user', 'not-json');
    expect(service.getCurrentUser()).toBeNull();
  });

  it('getToken and logout behavior', () => {
    localStorage.setItem('mslab_token', 'tok-now');
    localStorage.setItem('mslab_current_user', JSON.stringify({}));

    expect(service.getToken()).toBe('tok-now');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login should propagate error when login request fails', done => {
    service.login('bad', 'creds').subscribe({
      next: () => fail('should not succeed'),
      error: err => {
        expect(err.status).toBe(401);
        done();
      }
    });

    const reqLogin = httpMock.expectOne(`${AUTH_BASE}/auth/login`);
    expect(reqLogin.request.method).toBe('POST');
    reqLogin.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('constructor/hasToken should set loggedIn when token exists before service creation', () => {
    localStorage.setItem('mslab_token', 'existing-token');
    const http = TestBed.inject(HttpClient);
    const inst = new AuthService(http);
    expect(inst.isLoggedIn()).toBeTrue();
    localStorage.removeItem('mslab_token');
  });
});