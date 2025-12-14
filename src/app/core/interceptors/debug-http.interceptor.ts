import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DebugHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('[HTTP OUT]', req.method, req.url, req.headers.get('Authorization') ? 'AUTH=YES' : 'AUTH=NO');

    return next.handle(req).pipe(
      tap({
        next: (evt) => {
          if (evt instanceof HttpResponse) {
            console.log('[HTTP IN ]', req.method, req.url, 'status=', evt.status, 'body=', evt.body);
          }
        },
        error: (err) => {
          console.error('[HTTP ERR]', req.method, req.url, 'status=', err?.status, 'err=', err);
        }
      })
    );
  }
}
