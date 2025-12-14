import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth';

describe('UserService', () => {
  let service: UserService;

  const authServiceMock = {
    // agrega aquí solo lo que realmente use UserService
    getToken: () => 'fake-token',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
