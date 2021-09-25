import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {config} from 'config';
import {User} from '../interfaces/user'
import {HttpHeaders} from "@angular/common/http";
import {OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {responseStatus} from "../interfaces/response-status";
import {responseRefreshToken} from "../interfaces/response-refresh-token";
import {responseUserData} from "../interfaces/response-user-data";
import {responseDeleteTask} from "../interfaces/response-delete-task";

const httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

@Injectable({providedIn: 'root'})

export class AuthService implements OnInit{

  constructor(private http: HttpClient){ }

  ngOnInit(): void {

  }

  refresh() {

    const body = {refreshToken: localStorage.getItem('refresh')};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/refresh`, jsonBody, httpOptions)
  }

  refreshTokens(): Observable<responseRefreshToken> {

    const body = {refreshToken: localStorage.getItem('refresh')};

    let jsonBody = JSON.stringify(body);

    return this.http.post<responseRefreshToken>(`http://${config.development.host}:${config.development.port}/refresh`, jsonBody, httpOptions);
  }

  signUp(email: string, password: string): Observable<responseUserData> {

    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);

    return this.http.post<responseUserData>(`http://${config.development.host}:${config.development.port}/signup`, jsonBody, httpOptions);

  };

  logIn(email: User, password: User): Observable<responseUserData> {
    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);

    return this.http.post<responseUserData>(`http://${config.development.host}:${config.development.port}/login`, jsonBody, httpOptions);

  };

  googleSignUp(email: string, provider: string): Observable<responseUserData> {

    let body: {} = {email: email, provider: provider};
    let jsonBody = JSON.stringify(body);

    return this.http.post<responseUserData>(`http://${config.development.host}:${config.development.port}/signup/google`, jsonBody, httpOptions);

  };

  logOut(): Observable<responseStatus> {

    let body: {} = {accessToken: localStorage.getItem('token') as string};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.post<responseStatus>(`http://${config.development.host}:${config.development.port}/logout`, jsonBody, httpOptions);
  }

}


