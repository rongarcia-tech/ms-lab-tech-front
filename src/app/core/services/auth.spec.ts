import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const AUTH_BASE = 'https://ip172-18-0-6-d548e8q91nsg00bgpn20-8080.direct.labs.play-with-docker.com';

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
      expect(service.getRoles()).toEqual(['ADMIN']); // from getMe
      done();
    });

    const reqLogin = httpMock.expectOne(`${AUTH_BASE}/auth/login`);
    expect(reqLogin.request.method).toBe('POST');
    reqLogin.flush({ token: 'tok-123', roles: ['ADMIN'] });

    const reqMe = httpMock.expectOne(`${AUTH_BASE}/users/me`);
    expect(reqMe.request.method).toBe('GET');
    reqMe.flush({ id: 1, username: 'u', roles: ['ADMIN'] });
  });

  it('login should succeed when getMe fails (still returns true)', done => {
    spyOn(localStorage, 'setItem').and.callThrough();

    service.login('u2', 'p2').subscribe(res => {
      expect(res).toBeTrue();
      expect(localStorage.getItem('mslab_token')).toBe('tok-err');
      expect(localStorage.getItem('mslab_current_user')).toBeNull();
      expect(service.getRoles()).toEqual(['USER']); // from login response
      done();
    });

    const reqLogin = httpMock.expectOne(`${AUTH_BASE}/auth/login`);
    reqLogin.flush({ token: 'tok-err', roles: ['USER'] });

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

  it('getMe should return user data', done => {
    service.getMe().subscribe(user => {
      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
      done();
    });

    const req = httpMock.expectOne(`${AUTH_BASE}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, username: 'testuser' });
  });

  it('getRoles should return current roles', () => {
    localStorage.setItem('mslab_roles', JSON.stringify(['ADMIN', 'USER']));
    // Reload roles
    const roles = (service as any).loadRolesFromStorage();
    (service as any).setRoles(roles);
    expect(service.getRoles()).toEqual(['ADMIN', 'USER']);
  });

  it('hasRole should return true for matching role', () => {
    (service as any).setRoles(['ADMIN', 'ROLE_USER']);
    expect(service.hasRole('ADMIN')).toBeTrue();
    expect(service.hasRole('ROLE_ADMIN')).toBeTrue(); // normalized
    expect(service.hasRole('USER')).toBeTrue();
    expect(service.hasRole('NONEXISTENT')).toBeFalse();
  });

  it('hasAnyRole should return true if any role matches', () => {
    (service as any).setRoles(['ADMIN']);
    expect(service.hasAnyRole('ADMIN', 'USER')).toBeTrue();
    expect(service.hasAnyRole('USER', 'GUEST')).toBeFalse();
  });

  it('loadRolesFromStorage should prefer user roles over direct roles', () => {
    localStorage.setItem('mslab_current_user', JSON.stringify({ roles: ['USER'] }));
    localStorage.setItem('mslab_roles', JSON.stringify(['ADMIN']));
    expect((service as any).loadRolesFromStorage()).toEqual(['USER']);
  });

  it('loadRolesFromStorage should use direct roles if no user', () => {
    localStorage.removeItem('mslab_current_user');
    localStorage.setItem('mslab_roles', JSON.stringify(['ADMIN']));
    expect((service as any).loadRolesFromStorage()).toEqual(['ADMIN']);
  });

  it('loadRolesFromStorage should return empty array on invalid data', () => {
    localStorage.removeItem('mslab_current_user');
    localStorage.setItem('mslab_roles', 'invalid-json');
    expect((service as any).loadRolesFromStorage()).toEqual([]);
  });
});