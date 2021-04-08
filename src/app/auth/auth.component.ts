import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authservice: AuthService,
              private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onSubmit(authForm: NgForm) {
    // Since an hacker could manipulate the DOM - you better add a level of protection
    // Not perfect but minimal
    if (!authForm.valid) return;
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authservice.login(authForm.value.email, authForm.value.password);
    }
    else {
      authObs = this.authservice.signUp(authForm.value.email, authForm.value.password);
    }

    authObs.subscribe( responseData => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.router.navigate(['/recipes']);
        }, errorMessage => {
          console.log(errorMessage);
          this.isLoading = false;
          this.error = errorMessage;
        });

    authForm.reset();
  }

  onHandleError() {
    this.error = null;
  }

}
