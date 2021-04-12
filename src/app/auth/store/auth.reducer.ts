import { User } from '../user.model';
import * as AuthActions from './auth.actions';

// Historic: the user was once stored in the auth.service as a BehaviorSubject<User>.

// the two places where we use the 'select' are
// 1- from the auth-interceptor.service file since we only need that token basically
// 2- header.component

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: user  // which property to overide ? 'user'
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null  // which property to overide ? 'user'
      };
    default:
      return state;
  }
}
