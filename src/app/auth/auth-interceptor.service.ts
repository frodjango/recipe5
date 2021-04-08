import { HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        // Could also filter on URL - and add token only for those
        if (!user) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone( {
          params: new HttpParams().set('auth', user.token)
        })
        return next.handle(modifiedRequest);
      }));
  }
}
