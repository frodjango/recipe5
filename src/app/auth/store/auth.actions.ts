import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';

// inspired bu our previous method of storing new User logged in
// const user = new User(email, id, token, expirationDate); FROM
//

// Two options for the new - create it in the reducer or in the service as before
// Let's move the maximum amout of code in the reducer so we receive in the payload
// the various fields required from a new logged in user

// Let's first dispatch from the auth.service


export class Login implements Action {
  readonly type = LOGIN;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

// no payload required
export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;
