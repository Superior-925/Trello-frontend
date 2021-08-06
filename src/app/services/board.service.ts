import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {config} from "../../../config";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})

export class BoardService {

  token: any = localStorage.getItem('token');

  constructor(private http: HttpClient, private router: Router) {
  }

  loadBoards(): Observable<any> {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response', params: {param: localStorage.getItem('userId')}, responseType: 'text'
    };

    return this.http.get(`http://${config.development.host}:${config.development.port}/board`, httpOptionsGet);

  }

  addBoard(boardName: string) {

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }), observe: 'response'
    };

    let body: {} = {boardName: boardName, userId: localStorage.getItem('userId')};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/board`, jsonBody, httpOptions);
  }

  deleteBoard(id: number) {

    let httpOptionsDelete: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response', params: {boardId: id, userId: localStorage.getItem('userId')}
    };

    return this.http.delete(`http://${config.development.host}:${config.development.port}/board`, httpOptionsDelete);
  }

  renameBoard(boardId: number, boardName: string) {

    let body: {} = {boardId: boardId, boardName: boardName};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }), observe: 'response'
    };

    return this.http.put(`http://${config.development.host}:${config.development.port}/board`, jsonBody, httpOptions);
  }

  inviteCreateLink(boardId: number) {

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }), observe: 'response'
    };

    let body: {} = {boardId: boardId, userId: localStorage.getItem('userId')};

    let jsonBody = JSON.stringify(body);
    console.log(jsonBody);

    return this.http.post(`http://${config.development.host}:${config.development.port}/board/invitation`, jsonBody, httpOptions);

  }

  invite(link: string, userId: any) {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response', params: {userId: userId}, responseType: 'text'
    };

    return this.http.get(`http://${config.development.host}:${config.development.port}/board/invitation/` + link, httpOptionsGet);
  }

  loadInvitedUsers(boardId: number) {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response', responseType: 'text'
    };

    return this.http.get(`http://${config.development.host}:${config.development.port}/board/invitation/users/` + boardId, httpOptionsGet);
  }

}
