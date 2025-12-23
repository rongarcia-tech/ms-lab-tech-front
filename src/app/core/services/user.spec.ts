import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth';
import { API_AUTH_BASE_URL } from '../config/api.config';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCurrentUser should return user when authService has one', (done) => {
    const mockUser = { id: 1, username: 'u1' } as any;
    authServiceMock.getCurrentUser.and.returnValue(mockUser);

    service.getCurrentUser().subscribe(u => {
      expect(u).toEqual(mockUser);
      done();
    });
  });

  it('getCurrentUser should throw when no current user', (done) => {
    authServiceMock.getCurrentUser.and.returnValue(null as any);

    service.getCurrentUser().subscribe({
      next: () => fail('should not emit'),
      error: err => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });

  it('listUsers should GET users', () => {
    let res: any;
    service.listUsers().subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/users`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, username: 'u' }]);

    expect(res.length).toBe(1);
  });

  it('getUserById should GET user by id', () => {
    let res: any;
    service.getUserById('2').subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/users/2`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 2, username: 'u2' });
    expect(res.id).toBe(2);
  });

  it('createUser should normalize and transform the request body', () => {
    const req = {
      username: '  user ',
      email: '  email@test.com  ',
      password: 'pass',
      labCode: ' lab123 ',
      roles: ['role_admin', ' USER ', null, ''],
      active: true
    } as any;
    let res: any;
    service.createUser(req).subscribe(r => (res = r));

    const reqHttp = httpMock.expectOne(`${API_AUTH_BASE_URL}/users`);
    expect(reqHttp.request.method).toBe('POST');
    expect(reqHttp.request.body).toEqual({
      username: 'user',
      email: 'email@test.com',
      password: 'pass',
      labCode: 'LAB123',
      roles: ['ADMIN', 'USER'],
      active: true
    });
    reqHttp.flush({ id: 10 });
    expect(res.id).toBe(10);
  });

  it('createUser should handle empty labCode and roles', () => {
    const req = {
      username: 'user2',
      email: 'email2@test.com',
      password: 'pass2',
      labCode: '',
      roles: [],
      active: false
    } as any;
    service.createUser(req).subscribe();

    const reqHttp = httpMock.expectOne(`${API_AUTH_BASE_URL}/users`);
    expect(reqHttp.request.body.labCode).toBeNull();
    expect(reqHttp.request.body.roles).toEqual([]);
    expect(reqHttp.request.body.active).toBeFalse();
    reqHttp.flush({});
  });

  it('updateUser should PUT and return updated user', () => {
    const body = { email: 'e@x.com' } as any;
    let res: any;
    service.updateUser('8', body).subscribe(r => (res = r));

    const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/users/8`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 8 });
    expect(res.id).toBe(8);
  });
});
