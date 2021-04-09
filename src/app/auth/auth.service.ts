import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';
import { Store } from "@ngrx/store";

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

// From firebase API definition

export interface AuthResponseData {
  idToken:string,	      // A Firebase Auth ID token for the newly created user.
  email:string,	        // The email for the newly created user.
  refreshToken:	string,	// A Firebase Auth refresh token for the newly created user.
  expiresIn:string,	    // The number of seconds in which the ID token expires.
  localId:string	      // The uid of the newly created user.
  registered?: boolean	  // Whether the email is for an existing account.
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private signUpUrl: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
  private loginUrl: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  private API_KEY: string = environment.firebaseAPIKey;

  // We want to make the token available to another service (data-storage) -> BehaviorSubject

  // user = new BehaviorSubject<User>(null); // will propagate the user status across the app (e.g. header component)
  private tokenExpirationTimer: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
          this.signUpUrl + this.API_KEY,
          {
            email: email, password: password, returnSecureToken: true
          }
      )
      .pipe(catchError(this.handleError), tap(responseData => {
        console.log("RESPONSE DATA TOKEN: " + responseData.idToken);

        this.handleAuthentication(responseData.email,
          responseData.localId,
          responseData.idToken,
          +responseData.expiresIn)
      }));
  }

    login(email: string, password: string) {
      return this.http
      .post<AuthResponseData>(
          this.loginUrl + this.API_KEY,
          {
            email: email, password: password, returnSecureToken: true
          })
      .pipe(catchError(this.handleError), tap(responseData => {
        console.log("RESPONSE DATA TOKEN: " + responseData.idToken);
        this.handleAuthentication(
          responseData.email,
          responseData.localId,
          responseData.idToken,
          +responseData.expiresIn)
      }))
    }

    private handleAuthentication(email: string,
                                 id: string,
                                 token: string,
                                 expiresIn : number) {
      const expiresInMsec = expiresIn * 1000;
      const expirationInMsec = new Date().getTime() + expiresInMsec;
      const expirationDate = new Date(expirationInMsec);
      const user = new User(email, id, token, expirationDate);
      // this.user.next(user);
      this.store.dispatch(new AuthActions.Login({
        email: email,
        userId: id,
        token: token,
        expirationDate: expirationDate
        }))
      this.autoLogout(expiresInMsec);
      localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResp: HttpErrorResponse) {
      let errorMessage = 'An unknown error occured';
      if (!errorResp.error || !errorResp.error.error) {
        return throwError(errorMessage);
      }
      switch (errorResp.error.error.message) {
        case 'EMAIL_EXISTS': {
          errorMessage = 'The email address is already in use by another account';
          break;
        }
        case 'OPERATION_NOT_ALLOWED': {
          errorMessage = 'assword sign-in is disabled for this project.';
          break;
        }
        case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
          errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
        }
        case 'EMAIL_NOT_FOUND': {
          errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
        }
        case 'INVALID_PASSWORD': {
          errorMessage = 'The password is invalid or the user does not have a password';
          break;
        }
        case 'USER_DISABLED': {
          errorMessage = 'The user account has been disabled by an administrator';
          break;
        }
      }
      return throwError(errorMessage);
    }

    autoLogin() {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return;
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      )

      if (loadedUser.token) {
        // this.user.next(loadedUser);

        this.store.dispatch(new AuthActions.Login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
          })
        )
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }

    // number of msec
    autoLogout(expirationDuration: number) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, expirationDuration);
    }

    logout() {
      // this.user.next(null);
      this.store.dispatch(new AuthActions.Logout());
      this.router.navigate(['/auth']);
      // localStorage.clear();
      localStorage.removeItem('userData');
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
    }


}
