import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  providers: [AuthService]
})

export class SignupPageComponent {

  signUpForm : FormGroup;

  user: SocialUser;
  loggedIn: boolean;

  emailAlreadyExist: boolean = false;

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

  submit(){
    this.authService.signUp(this.signUpForm.value.email, this.signUpForm.value.password).subscribe((responseData) => {
        localStorage.setItem('token', responseData.body.token);
        localStorage.setItem('refresh', responseData.body.refresh.token);
        localStorage.setItem('userId', responseData.body.userId);
        if (responseData.status == 200) {
          this.router.navigate(['/boards']);
        }
      },
      error => {
      console.log(error);
        if (error.status == 409) {
          this.emailAlreadyExist = true;
        }
    });
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  signupWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.socialAuthService.authState.subscribe((user) => {
          this.user = user;
          this.loggedIn = (user != null);
          this.authService.googleSignUp(user.email, user.provider).subscribe((responseData) => {
              if (responseData.status == 200) {
                localStorage.setItem('token', responseData.body.token);
                localStorage.setItem('refresh', responseData.body.refresh.token);
                localStorage.setItem('userId', responseData.body.userId);
                this.router.navigate(['/boards']);
              }
            },
            error => console.log(error));
        });
      });
  }

}
