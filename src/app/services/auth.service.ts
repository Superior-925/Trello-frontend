import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {config} from 'config';
import {User} from '../interfaces/user'
import {HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

const httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

@Injectable({providedIn: 'root'})

export class AuthService {

  constructor(private http: HttpClient, private router: Router){ }

  signUp(email: User, password: User){

    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);
    console.log(jsonBody);

    return this.http.post(`http://${config.development.host}:${config.development.port}/signup`, jsonBody, httpOptions)
      .subscribe((responseData: any) => {
        if (responseData.status == 200) {
          this.router.navigate(['/workspace']);
        }
        localStorage.setItem('token', responseData.body.token);
        localStorage.setItem('userId', responseData.body.id);
      },
      error => console.log(error));
  }

  logIn(email: User, password: User){
    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/login`, jsonBody, httpOptions)
      .subscribe((responseData: any) => {
        if (responseData.status == 200) {
          this.router.navigate(['/workspace']);
        }
        localStorage.setItem('token', responseData.body.token);
        localStorage.setItem('userId', responseData.body.id);
      },
      error => console.log(error));
  }

  googleLogIn() {
    return (
      this.http.get(`http://${config.development.host}:${config.development.port}/login/google`)
        .subscribe());
  }

}


