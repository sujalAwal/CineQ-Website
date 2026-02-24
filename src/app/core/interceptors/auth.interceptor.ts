import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  // Clone request with credentials to include HttpOnly cookies
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle rate limiting (429 Too Many Requests)
      if (error.status === 429) {
        const retryAfter = error.headers.get('Retry-After') || 
                          error.headers.get('X-Rate-Limit-Retry-After-Seconds') || 
                          '60';
        toastService.error('Too Many Requests', `Please try again in ${retryAfter} seconds.`);
      }
      
      // If 401 Unauthorized, clear session (token expired / invalid / blacklisted)
      if (error.status === 401 && authService.isAuthenticated()) {
        authService.handleSessionExpired();
      }
      
      return throwError(() => error);
    })
  );
};
