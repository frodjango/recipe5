import { HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, map, take } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
        take(1),
        map(authState => {
          return authState.user;
        }),
        exhaustMap(user => {
          // Could also filter on URL - and add token only for those
          if (!user) {
            return next.handle(req);
          }
          const modifiedRequest = req.clone( {
            params: new HttpParams().set('auth', user.token)
          });
          return next.handle(modifiedRequest);
        }));
  }


}
