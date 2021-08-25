import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {config} from 'config';
import {User} from '../interfaces/user'
import {HttpHeaders} from "@angular/common/http";
import {OnInit} from "@angular/core";

const httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

@Injectable({providedIn: 'root'})

export class AuthService implements OnInit{

  //token: any = localStorage.getItem('token');

  constructor(private http: HttpClient){ }

  ngOnInit(): void {

  }

  refreshTokens() {

    const body = {refreshToken: localStorage.getItem('refresh')};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/refresh`, jsonBody, httpOptions);
  }

  signUp(email: User, password: User){

    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);

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

  logOut() {

    let body: {} = {accessToken: localStorage.getItem('token') as string};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.post(`http://${config.development.host}:${config.development.port}/logout`, jsonBody, httpOptions);
  }

}


