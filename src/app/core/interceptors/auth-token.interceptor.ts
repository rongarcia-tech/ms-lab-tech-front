import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_AUTH_BASE_URL, API_LABS_BASE_URL } from '../config/api.config';

const TOKEN_KEY = 'mslab_token'; // lo vamos a usar en AuthService también

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthOrLabsApi =
      req.url.startsWith(API_AUTH_BASE_URL) || req.url.startsWith(API_LABS_BASE_URL);

    // No tocamos requests que no sean a tus MS
    if (!isAuthOrLabsApi) return next.handle(req);

    // Rutas públicas según tu config Spring Security
    const isPublic =
      req.url === `${API_AUTH_BASE_URL}/auth/login` ||
      req.url === `${API_AUTH_BASE_URL}/.well-known/jwks.json` ||
      req.url.endsWith('/actuator/health') ||
      req.url.includes('/v3/api-docs') ||
      req.url.includes('/swagger-ui');

    if (isPublic) return next.handle(req);

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next.handle(authReq);
  }
}
