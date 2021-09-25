import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {config} from "../../../config";
import {Observable} from "rxjs";
import {responseTask} from '../interfaces/response-task';
import {responseExecutors} from "../interfaces/response-executors";
import {deleteExecutor} from "../interfaces/delete-executor";
import {responseActions} from "../interfaces/response-actions";
import {responseDeleteTask} from "../interfaces/response-delete-task";
import {responseStatus} from "../interfaces/response-status";
import {responseExecutor} from "../interfaces/response-executor";
import {responseArchiveTask} from "../interfaces/response-archive-task";
import {responseRestoreTasks} from "../interfaces/response-restore-tasks";
import {responseRestoreSingleTask} from "../interfaces/response-restore-single-task";
import {inviteResponseBoard} from "../interfaces/invite-response-board";
import {responseTasks} from "../interfaces/response-tasks";
import {responseFoundTasks} from "../interfaces/response-found-tasks";
import {responseBoardOwner} from "../interfaces/response-board-owner";

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  constructor(private http: HttpClient) { }

  addTask(userId: string, boardId: number, listName: string, taskTitle: string, order: number, listNameId: number):Observable<responseTask> {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

    let body: {} = {userId: userId, boardId: boardId, listName: listName, taskTitle: taskTitle, order: order, listId: listNameId};
    let jsonBody = JSON.stringify(body);

    return this.http.post<responseTask>(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);

  }

  loadTasks(boardId: number): Observable<responseTasks[]> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), params: {param: boardId}};

    return this.http.get<responseTasks[]>(`http://${config.development.host}:${config.development.port}/task`, httpOptionsGet);

  }

  deleteTask(taskId: number): Observable<responseDeleteTask> {
    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response',params: {param: taskId}};

      return this.http.delete<responseDeleteTask>(`http://${config.development.host}:${config.development.port}/task`, httpOptionsDelete);
  }

  renameTask(taskId: number, taskTitle: string | null, taskText: string | null): Observable<responseStatus> {

    let body: {} = {taskId: taskId, taskTitle: taskTitle, taskText: taskText};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.put<responseStatus>(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);
  }

  deleteAllTasks(idsArray: object): Observable<responseStatus> {


    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response',params: {taskIds: idsArray}};

    return this.http.delete<responseStatus>(`http://${config.development.host}:${config.development.port}/task`, httpOptionsDelete);

  }

  searchTask(boardId: number, taskTitle: string): Observable<responseFoundTasks> {
    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response',params: {boardId: boardId, taskTitle: taskTitle}};

    return this.http.get<responseFoundTasks>(`http://${config.development.host}:${config.development.port}/task/search`, httpOptionsGet);
  }

  selectExecutor(taskId: number, userId: number, boardId: number): Observable<responseExecutor> {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    let body: {} = {taskId: taskId, userId: userId, boardId: boardId};
    let jsonBody = JSON.stringify(body);

    return this.http.post<responseExecutor>(`http://${config.development.host}:${config.development.port}/task/executor`, jsonBody, httpOptions);
  }

  loadExecutors(boardId: number):Observable<responseExecutors> {
    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response'};

    return this.http.get<responseExecutors>(`http://${config.development.host}:${config.development.port}/task/executor` + boardId, httpOptionsGet);
  }

  deleteExecutor(taskId: number, userId: number):Observable<deleteExecutor> {

    let httpOptionsDelete: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response',params: {taskId: taskId, userId: userId}};

    return this.http.delete<deleteExecutor>(`http://${config.development.host}:${config.development.port}/task/executor`, httpOptionsDelete);
  }

  archiveTasks(idsForArchive: number[]):Observable<responseStatus> {

    let body: {} = idsForArchive;
    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.patch<responseStatus>(`http://${config.development.host}:${config.development.port}/task`, jsonBody, httpOptions);
  }

  archiveSingleTask(taskId: number):Observable<responseArchiveTask> {


    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response', params: {param: taskId}, responseType: 'text'};

    return this.http.patch<responseArchiveTask>(`http://${config.development.host}:${config.development.port}/task` + taskId, null, httpOptions);
  }

  loadArchivedTasks(boardId: number):Observable<responseArchiveTask> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response', params: {param: boardId}, responseType: 'text'};

    return this.http.get<responseArchiveTask>(`http://${config.development.host}:${config.development.port}/task/archive`, httpOptionsGet);

  }

  restoreTasks(listId: any, archivedTasks: any, boardId: number):Observable<responseRestoreTasks> {

    let body: {} = {listId: listId, archivedTasks: archivedTasks, boardId: boardId};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.put<responseRestoreTasks>(`http://${config.development.host}:${config.development.port}/task/archive`, jsonBody, httpOptions);

  }

  restoreSingleTask(taskId: number):Observable<responseRestoreSingleTask> {

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.put<responseRestoreSingleTask>(`http://${config.development.host}:${config.development.port}/task/archive` + taskId, null, httpOptions);

  }

  loadActionsOfTasks(boardId: number): Observable<any> {

    let httpOptionsGet: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      observe: 'response', responseType: 'text'};

    return this.http.get(`http://${config.development.host}:${config.development.port}/task/actions` + boardId, httpOptionsGet);
  }

  loadBoardRigths(boardId: number): Observable<responseBoardOwner> {

    let httpOptionsGet: {} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response', params: {userId: localStorage.getItem('userId'), boardId: boardId}
    };

    return this.http.get<responseBoardOwner>(`http://${config.development.host}:${config.development.port}/board/rights`, httpOptionsGet);

  }

  taskChangeList(task: any, taskId: number, listId: number) {

    let body: {} = {task, listId: listId};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task/list` + taskId, jsonBody, httpOptions);
  }

  taskOrder(taskId: number, taskOrder: number) {

    let body: {} = {taskOrder: taskOrder};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

    return this.http.put(`http://${config.development.host}:${config.development.port}/task/order` + taskId, jsonBody, httpOptions);
  }

}


