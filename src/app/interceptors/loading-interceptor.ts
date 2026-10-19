import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Set on a request to keep the full-page loader hidden for it, e.g. a
 * background refresh: `http.get(url, { context: new HttpContext().set(SKIP_PAGE_LOADER, true) })`
 */
export const SKIP_PAGE_LOADER = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loading = inject(LoadingService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(SKIP_PAGE_LOADER)) return next.handle(req);

    this.loading.start();
    // finalize runs on success, error and cancellation alike
    return next.handle(req).pipe(finalize(() => this.loading.stop()));
  }
}
