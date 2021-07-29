import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {config} from "../../../config";
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class TaskService {

  token: any = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  addTask(userId: string, boardId: number, listName: string, taskTitle: string, taskText: string) {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}), observe: 'response'};

    let body: {} = {userId: userId, boardId: boardId, listName: listName, taskTitle: taskTitle, taskText: taskText};
    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);

  }

  loadTasks(boardId: number): Observable<any> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response',params: {param: boardId}, responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task`, httpOptionsGet);

  }


}


