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

  addTask(userId: string, boardId: number, listName: string, taskTitle: string) {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}), observe: 'response'};

    let body: {} = {userId: userId, boardId: boardId, listName: listName, taskTitle: taskTitle};
    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);

  }

  loadTasks(boardId: number): Observable<any> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response',params: {param: boardId}, responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task`, httpOptionsGet);

  }

  deleteTask(taskId: number) {
    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response',params: {param: taskId}};

      return this.http.delete(`http://${config.development.host}:${config.development.port}/task`, httpOptionsDelete);
  }

  renameTask(taskId: number, taskTitle: any, taskText: any) {

    let body: {} = {taskId: taskId, taskTitle: taskTitle, taskText: taskText};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);
  }

  deleteAllTasks(idsArray: object) {
    console.log(idsArray);

    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response',params: {taskIds: idsArray}};

    return this.http.delete(`http://${config.development.host}:${config.development.port}/task`, httpOptionsDelete);

  }

  searchTask(boardId: number, taskTitle: string): Observable<any> {
    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response',params: {boardId: boardId, taskTitle: taskTitle}, responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/search`, httpOptionsGet);
  }

  selectExecutor(taskId: number, userId: number, boardId: number) {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}), observe: 'response'};

    let body: {} = {taskId: taskId, userId: userId, boardId: boardId};
    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/task/executor`, jsonBody, httpOptions);
  }

  loadExecutors(boardId: number) {
    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response', responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/executor` + boardId, httpOptionsGet);
  }

  deleteExecutor(taskId: number, userId: number) {

    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}),
      observe: 'response',params: {taskId: taskId, userId: userId}};

    return this.http.delete(`http://${config.development.host}:${config.development.port}/task/executor`, httpOptionsDelete);
  }

  archiveTasks(idsForArchive: any) {

    let body: {} = idsForArchive;
    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}), observe: 'response'};

    return this.http.patch(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);
  }
}


