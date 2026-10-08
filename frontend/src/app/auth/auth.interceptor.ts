import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const AUTH_PAGES = ['/sign-in', '/sign-up'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Cookies (access/refresh/XSRF) only travel if credentials are enabled.
  const request = req.clone({ withCredentials: true });

  return next(request).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;

      // /api/auth/* 401s are handled by the callers (wrong password, "am I
      // logged in?" probe, ...). Redirecting on those would cause loops.
      const isAuthEndpoint = req.url.startsWith('/api/auth/');
      const onAuthPage = AUTH_PAGES.some((page) => router.url.startsWith(page));

      if (isUnauthorized && !isAuthEndpoint && !onAuthPage) {
        void router.navigate(['/sign-in']);
      }
      return throwError(() => error);
    }),
  );
};