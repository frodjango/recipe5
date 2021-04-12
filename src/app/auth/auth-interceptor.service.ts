import { HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";

// We decided to create this 'interceptor' since we needed to inject suer token in recipe
// http request Video 20.17

// Applies only to recipe module - see core.module.ts


@Injectable()  // not providedIn: 'root'
export class AuthInterceptorService implements HttpInterceptor{

  constructor(
    // In order to access the token - we need to get it...
    private store: Store<fromApp.AppState>
    ) {}

    // the challenge here is to chain two observables
    // 1- the user info - the user info comes from an observable THEN
    // 2- the handle (modifiedRequest) - HttpHandler - the MAIN task

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Was accessing the auth service BehaviorSubject 'user" before...but we're getting rid
    // of this variable now with the ngrx store

    // We'll use the same trick as in data-storage.service / fetchRecipes (2 observables).
    // Looks like chaining 2 tasks (first: the user info, second: the request handle)
    return this.store.select('auth').pipe(
      take(1),
      // Prior to using the store we used the auth-service property user that did return an
      // object of type User.
      // Now we need an extra layer (map) to modify the argument of type { user: User}  that is
      // an object with a 'user' property, TOWARD a simple User (like some kind of casting...)
      map(authState => authState.user),
      exhaustMap(user => {
        // Could also filter on URL - and add token only for those
        if (!user) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedRequest);    // This is the main line of this interceptor function
      })
       );
  }


}
