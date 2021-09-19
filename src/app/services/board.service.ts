import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {config} from "../../../config";
import {Observable} from "rxjs";
import {responseBoard} from '../interfaces/response-board';
import {addBoardResponse} from '../interfaces/add-board-response';
import {responseInvitedUsers} from '../interfaces/response-invited-users';
import {inviteResponseBoard} from '../interfaces/invite-response-board';
import {boardList} from "../interfaces/board-list";
import {responseBoardOwner} from "../interfaces/response-board-owner";

@Injectable({providedIn: 'root'})

export class BoardService {

  boardOwner: boolean;

  constructor(private http: HttpClient, private router: Router) {
  }

  loadBoards(): Observable<responseBoard> {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', params: {param: localStorage.getItem('userId')}, responseType: 'text'
    };

    return this.http.get<responseBoard>(`http://${config.development.host}:${config.development.port}/board`, httpOptionsGet);

  }

  // addBoard(boardName: string): Observable<addBoardResponse> {
  //
  //   let httpOptions: {} = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': localStorage.getItem('token') as string
  //     }), observe: 'response'
  //   };
  //
  //   let body: {} = {boardName: boardName, userId: localStorage.getItem('userId')};
  //
  //   let jsonBody = JSON.stringify(body);
  //
  //   return this.http.post<addBoardResponse>(`http://${config.development.host}:${config.development.port}/board`, jsonBody, httpOptions);
  // }

  addBoard(boardName: string): Observable<any> {

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') as string
      }), observe: 'response'
    };

    let body: {} = {boardName: boardName, userId: localStorage.getItem('userId')};

    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/board`, jsonBody, httpOptions);
  }

  loadLists(boardId: number): Observable<boardList[]> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string})
    };

    return this.http.get<boardList[]>(`http://${config.development.host}:${config.development.port}/board/lists/`+boardId, httpOptionsGet);
  }

  deleteBoard(id: number): Observable<addBoardResponse> {

    let httpOptionsDelete: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', params: {boardId: id, userId: localStorage.getItem('userId')}
    };

    return this.http.delete<addBoardResponse>(`http://${config.development.host}:${config.development.port}/board`, httpOptionsDelete);
  }

  renameBoard(boardId: number, boardName: string): Observable<addBoardResponse> {

    let body: {} = {boardId: boardId, boardName: boardName};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') as string
      }), observe: 'response'
    };

    return this.http.put<addBoardResponse>(`http://${config.development.host}:${config.development.port}/board`, jsonBody, httpOptions);
  }

  inviteCreateLink(boardId: number):Observable<inviteResponseBoard> {

    let httpOptions: {} = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') as string
      }), observe: 'response'
    };

    let body: {} = {boardId: boardId, userId: localStorage.getItem('userId')};

    let jsonBody = JSON.stringify(body);

    return this.http.post<inviteResponseBoard>(`http://${config.development.host}:${config.development.port}/board/invitation`, jsonBody, httpOptions);

  }

  invite(link: string, userId: any) {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', params: {userId: userId}, responseType: 'text'
    };

    return this.http.post(`http://${config.development.host}:${config.development.port}/board/invitation/` + link,null, httpOptionsGet);
  }

  loadInvitedUsers(boardId: number): Observable<responseInvitedUsers> {
    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', responseType: 'text'
    };

    return this.http.get<responseInvitedUsers>(`http://${config.development.host}:${config.development.port}/board/invitation/users/` + boardId, httpOptionsGet);
  }


  loadBoardRigth(boardId: number): Observable<responseBoardOwner> {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', params: {userId: localStorage.getItem('userId'), boardId: boardId}
    };

    return this.http.get<responseBoardOwner>(`http://${config.development.host}:${config.development.port}/board/rights`, httpOptionsGet);

  }


}
