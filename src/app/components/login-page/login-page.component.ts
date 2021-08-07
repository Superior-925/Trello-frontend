import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import {OnInit} from "@angular/core";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit{

  signUpForm : FormGroup;

  user: SocialUser;
  loggedIn: boolean;

  constructor(private router: Router, private authService: AuthService, private socialAuthService: SocialAuthService){
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
  ngOnInit(): void {

  }

  submit(){
    this.authService.logIn(this.signUpForm.value.email, this.signUpForm.value.password).subscribe( (responseData: any) => {

       localStorage.setItem('token', responseData.body.token);
       localStorage.setItem('userId', responseData.body.id);

      if (responseData.status == 200) {
        this.router.navigate(['/workspace']);
        }
      },
      error => console.log(error));
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  goToSignUpPage() {
    this.router.navigate(['/signup']);
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.socialAuthService.authState.subscribe((user) => {
          this.user = user;
          this.loggedIn = (user != null);
          this.authService.googleLogIn(user.email).subscribe( (responseData: any) => {
              localStorage.setItem('token', responseData.body.token);
              localStorage.setItem('userId', responseData.body.id);

              if (responseData.status == 200) {
                this.router.navigate(['/workspace']);
              }
            },
            error => console.log(error));
        });
      });
  }


}
