import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RolesService } from './roles.service';
import { API_AUTH_BASE_URL } from '../config/api.config';

describe('RolesService', () => {
  let service: RolesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolesService]
    });
    service = TestBed.inject(RolesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listRoles', () => {
    it('should fetch list of roles from API', () => {
      const mockRoles = [
        { id: 1, name: 'ADMIN', description: 'Administrador' },
        { id: 2, name: 'USER', description: 'Usuario' }
      ];

      service.listRoles().subscribe((roles) => {
        expect(roles.length).toBe(2);
        expect(roles).toEqual(mockRoles);
      });

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/roles`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRoles);
    });

    it('should handle error when fetching roles fails', () => {
      service.listRoles().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${API_AUTH_BASE_URL}/roles`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});
