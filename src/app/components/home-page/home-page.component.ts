import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (localStorage.getItem('refresh')) {
      this.authService.refreshTokens().subscribe((responseData: any) => {
        localStorage.removeItem('refresh');
        localStorage.removeItem('token');

        localStorage.setItem('refresh', responseData.body.refresh.token);
        localStorage.setItem('token', responseData.body.token);
        this.router.navigate(['/workspace']);
      })
    }
  }

  goToSignupPage() {
    this.router.navigate(['/signup']);
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

}
