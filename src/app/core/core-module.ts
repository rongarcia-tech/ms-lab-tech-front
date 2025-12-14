import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DebugHttpInterceptor } from './interceptors/debug-http.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { isDevMode } from '@angular/core';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
  ...(isDevMode()
    ? [{ provide: HTTP_INTERCEPTORS, useClass: DebugHttpInterceptor, multi: true }]
    : []),
  { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
]
})
export class CoreModule { }
