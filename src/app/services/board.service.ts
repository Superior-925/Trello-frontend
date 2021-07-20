import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {config} from "../../../config";
import {Board} from "../interfaces/board";

@Injectable()

export class BoardService {

  userToken: any;

  boardsArray: object[] = [];

  constructor(private http: HttpClient, private router: Router){ }

  addBoard(boardName: string, userId: any, addToken: any) {

    this.userToken = addToken;

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}`}), observe: 'response'};

    const body = {boardName: boardName, userId: userId};

    let jsonBody = JSON.stringify(body);
    console.log(jsonBody);

    return this.http.post(`http://${config.development.host}:${config.development.port}/board`, jsonBody, httpOptions).subscribe((responseData: any) => {
        let newBoard = new Board(responseData.body.boardName, userId);
        this.boardsArray.push(newBoard);
        console.log(this.boardsArray);
      },
      error => console.log(error));
}

}
