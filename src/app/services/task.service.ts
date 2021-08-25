import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {config} from "../../../config";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class TaskService {

  //token: any = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  addTask(userId: string, boardId: number, listName: string, taskTitle: string, order: number) {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    let body: {} = {userId: userId, boardId: boardId, listName: listName, taskTitle: taskTitle, order: order};
    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);

  }

  loadTasks(boardId: number): Observable<any> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response',params: {param: boardId}, responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task`, httpOptionsGet);

  }

  deleteTask(taskId: number) {
    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response',params: {param: taskId}};

      return this.http.delete(`http://${config.development.host}:${config.development.port}/task`, httpOptionsDelete);
  }

  renameTask(taskId: number, taskTitle: any, taskText: any) {

    let body: {} = {taskId: taskId, taskTitle: taskTitle, taskText: taskText};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);
  }

  deleteAllTasks(idsArray: object) {


    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response',params: {taskIds: idsArray}};

    return this.http.delete(`http://${config.development.host}:${config.development.port}/task`, httpOptionsDelete);

  }

  searchTask(boardId: number, taskTitle: string): Observable<any> {
    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response',params: {boardId: boardId, taskTitle: taskTitle}, responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/search`, httpOptionsGet);
  }

  selectExecutor(taskId: number, userId: number, boardId: number) {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    let body: {} = {taskId: taskId, userId: userId, boardId: boardId};
    let jsonBody = JSON.stringify(body);

    return this.http.post(`http://${config.development.host}:${config.development.port}/task/executor`, jsonBody, httpOptions);
  }

  loadExecutors(boardId: number) {
    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/executor` + boardId, httpOptionsGet);
  }

  deleteExecutor(taskId: number, userId: number) {

    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response',params: {taskId: taskId, userId: userId}};

    return this.http.delete(`http://${config.development.host}:${config.development.port}/task/executor`, httpOptionsDelete);
  }

  archiveTasks(idsForArchive: any) {

    let body: {} = idsForArchive;
    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.patch(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);
  }

  archiveSingleTask(taskId: number) {


    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response', params: {param: taskId}, responseType: 'text'};

    return this.http.patch(`http://${config.development.host}:${config.development.port}/task` + taskId, null, httpOptions);
  }

  loadArchivedTasks(boardId: number) {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response', params: {param: boardId}, responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/archive`, httpOptionsGet);

  }

  restoreTasks(listName: string, archivedTasks: any, boardId: number) {

    let body: {} = {listName: listName, archivedTasks: archivedTasks, boardId: boardId};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task/archive`, jsonBody, httpOptions);

  }

  restoreSingleTask(taskId: number) {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task/archive` + taskId, null, httpOptions);

  }

  loadActionsOfTasks(boardId: number): Observable<any> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/actions` + boardId, httpOptionsGet);
  }

  loadBoardRigths(boardId: number) {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}),
      observe: 'response', params: {userId: localStorage.getItem('userId'), boardId: boardId}, responseType: 'text'
    };

    return this.http.get(`http://${config.development.host}:${config.development.port}/board/rights`, httpOptionsGet);

  }

  taskChangeList(task: any, taskId: number) {

    let body: {} = {task};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task/list` + taskId, jsonBody, httpOptions);
  }

  taskOrder(taskId: number, taskOrder: number) {

    let body: {} = {taskOrder: taskOrder};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task/order` + taskId, jsonBody, httpOptions);
  }

}


