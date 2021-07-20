import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {

  signUpForm : FormGroup;

  constructor(private router: Router, private authService: AuthService){
    this.signUpForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  submit(){
    this.authService.logIn(this.signUpForm.value.email, this.signUpForm.value.password);
  }

  googleAuth() {
    console.log('Google authorization sucsecc')
    this.authService.googleLogIn();
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  goToSignUpPage() {
    this.router.navigate(['/signup']);
  }

}
