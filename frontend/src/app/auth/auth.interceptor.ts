import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Cookies (access/refresh/XSRF) only travel if credentials are enabled.
  // Authorization failures belong to the request caller. A global redirect
  // made public lesson and exercise pages look like they logged the visitor
  // out when an optional save or user-specific request failed.
  return next(req.clone({ withCredentials: true }));
};
