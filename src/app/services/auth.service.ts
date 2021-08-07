import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {config} from 'config';
import {User} from '../interfaces/user'
import {HttpHeaders} from "@angular/common/http";

const httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

@Injectable({providedIn: 'root'})

export class AuthService {

  constructor(private http: HttpClient){ }

  signUp(email: User, password: User){

    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);
    console.log(jsonBody);

    return this.http.post(`http://${config.development.host}:${config.development.port}/signup`, jsonBody, httpOptions);

  };

  logIn(email: User, password: User){
    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/login`, jsonBody, httpOptions);

  };

  googleSignUp(email: string, provider: string) {

    let body: {} = {email: email, provider: provider};
    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/signup/google`, jsonBody, httpOptions);

  };

  googleLogIn(email: string) {

    let body: {} = {email: email};
    let jsonBody = JSON.stringify(body);

     return this.http.post(`http://${config.development.host}:${config.development.port}/login/google`, jsonBody, httpOptions);

  };

}


