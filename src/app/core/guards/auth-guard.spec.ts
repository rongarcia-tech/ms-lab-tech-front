import { AuthGuard } from './auth-guard';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let authServiceMock: Pick<AuthService, 'isLoggedIn'>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceMock = {
      isLoggedIn: () => true
    };

    guard = new AuthGuard(authServiceMock as AuthService, routerMock);
  });

  it('debería permitir acceso si está logueado', () => {
    authServiceMock.isLoggedIn = () => true;

    const result = guard.canActivate({} as any, { url: '/private' } as any);

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería redirigir a /login si NO está logueado', () => {
    authServiceMock.isLoggedIn = () => false;

    const result = guard.canActivate({} as any, { url: '/private' } as any);

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/private' }
    });
  });
});
