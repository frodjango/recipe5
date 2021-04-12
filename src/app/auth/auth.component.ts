import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';

// As always we want to ONLY handle here the user interface aspects
//
// We will use a custom service dedicated to this 'module' for HTTP interactions and the
// low level authentication process
//
// We will use a route AND ngForm in HTML - the TEMPLATE approach

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode: boolean = true;    // Simplistic design just to introduce more complexity i.e a mode
  isLoading: boolean = false;     // a mode to drive the content of the HTML content
  error: string = null;           // if we have an error then store it here and give it to
                                  // <app-alert>

  constructor(private authservice: AuthService, private router: Router) {}

  // Event binding on click to toggle login/signup mode
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // The core functions are : template form + HTTP to 3rd party server
  onSubmit(authForm: NgForm) {
    // Since an hacker could manipulate the DOM - you better add a level of protection
    // Not perfect but minimal
    if (!authForm.valid) return;

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;  // Defined in auth.service

    // Working with http observable (as implemented in auth.service)
    if (this.isLoginMode) {
      authObs = this.authservice.login(authForm.value.email, authForm.value.password);
    }
    else {
      authObs = this.authservice.signUp(authForm.value.email, authForm.value.password);
    }

    // Handle reponse AND error from an auth.component eprpective only (i.e. modes and HTML)
    // The core of the authentication job is handled by the service

    // NOTICE that the second argument to subscribe is error processing
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

    // good idea to simply reset the form, being ok or errored
    authForm.reset();
  }

  // HTML will receive an event from <app-alert> and this will be sent to us to reset the event
  onHandleError() {
    this.error = null;
  }

}
