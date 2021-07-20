import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  providers: [AuthService]
})

export class SignupPageComponent {

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
    this.authService.signUp(this.signUpForm.value.email, this.signUpForm.value.password);
  }

  googleAuth() {
    console.log('Google authorization success')
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

}
