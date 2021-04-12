import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';
import { Store } from "@ngrx/store";

import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

// Service goals
//
// Fetch a remote authentication server for a specific format of data
// Provide basic authentication functions sucha as:
//  login, logout, signup
// and some extras such as autoLogin, autoLogout

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

  private tokenExpirationTimer: any = null;

  constructor(
    private http: HttpClient,   // an Injectable
    private router: Router,
    private store: Store<fromApp.AppState>
    ) {}

  // error handling described in video 20.11
  //

  // TYPESCRIPT TRICK
  //
  // .pipe(catchError( (errorResp: any) => {
  //   return this.handleError(errorResp);
  // }
  //
  // EQUIVALENT to
  //
  // .pipe(catchError(this.handleError))

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
          this.signUpUrl + this.API_KEY,  // url
          {                               // body
            email: email,
            password: password,
            returnSecureToken: true
          }
      )
      .pipe(  // will process the AuthResponseData formated response
        catchError(this.handleError),   // needs to return an observable
        // TAP: let's do some processing video 20.14 @ 5.00
        // TAP allow some operations without changing the response
        tap(responseData => {
          this.handleAuthentication(responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn)
        })
      );
    }

  login(email: string, password: string) {
    return this.http
    .post<AuthResponseData>(
        this.loginUrl + this.API_KEY,
        {
          email: email, password: password, returnSecureToken: true
        })
    .pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(
          responseData.email,
          responseData.localId,
          responseData.idToken,
          +responseData.expiresIn)
      })
    )
  }

  // Will be called from header button dedicated to 'Logout'
  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(email: string,
                                id: string,
                                token: string,
                                expiresIn : number) {
    const expiresInMsec = expiresIn * 1000;
    const expirationInMsec = new Date().getTime() + expiresInMsec;
    const expirationDate = new Date(expirationInMsec);
    // We'll take care of this following line later
    const user = new User(email, id, token, expirationDate);
    // Previously we use Subject to emit changes
    // We're comming from BOTH login AND signup
    this.store.dispatch(new AuthActions.Login({
      email: email,
      userId: id,
      token: token,
      expirationDate: expirationDate
      }))
    this.autoLogout(expiresInMsec);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // needs to return an observable
  // Ref to video 10.13
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

}
