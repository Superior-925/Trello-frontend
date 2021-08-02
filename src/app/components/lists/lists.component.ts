import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {TaskService} from "../../services/task.service";
import {AfterViewInit, OnChanges, OnInit, DoCheck} from "@angular/core";
import {Task} from "../../interfaces/task";
import {Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnChanges, AfterViewInit, OnInit, DoCheck {

  todoList: string = 'To Do';
  inProgressList: string = 'In Progress';
  codedList: string = 'Coded';
  testingList: string = 'Testing';
  doneList: string = 'Done';

  addTaskStatusTodoList: boolean = true;
  addTaskStatusProgressList: boolean = true;
  addTaskStatusCodedList: boolean = true;
  addTaskStatusTestingList: boolean = true;
  addTaskStatusDoneList: boolean = true;


  createTaskFormTodoList : FormGroup;
  createTaskFormProgressList: FormGroup;
  createTaskFormCodedList: FormGroup;
  createTaskFormTestingList: FormGroup;
  createTaskFormDoneList: FormGroup;

  searchTaskForm: FormGroup;

  boardTasks: any = [];

  todoListTasks: any = [];
  inProgressListTasks: any = [];
  codedListTasks: any = [];
  testingListTasks: any = [];
  doneListTasks: any = [];

  @Input() boardId: number;

  foundTasks: any = [];

  constructor(private taskService: TaskService) {
    this.createTaskFormTodoList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ]),
      taskText: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormProgressList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ]),
      taskText: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormCodedList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ]),
      taskText: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormTestingList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ]),
      taskText: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormDoneList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ]),
      taskText: new FormControl('', [
        Validators.required
      ])
    });
    this.searchTaskForm = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngAfterViewInit(): void {
    //console.log(this.boardId);
    //this.taskService.loadTasks(this.workSpaceComponent.boardId).subscribe();
  }

  ngOnChanges(): void {
    this.boardTasks =[];
    console.log(this.boardId);
    this.taskService.loadTasks(this.boardId).subscribe((responseData: any) => {
      //console.log(responseData.body);
      let parseResponse = JSON.parse(responseData.body);
      for (let i = 0; i < parseResponse.length; i++) {
        let newTask = new Task(parseResponse[i].listName, parseResponse[i].taskTitle, parseResponse[i].taskText, parseResponse[i].id);
        this.boardTasks.push(newTask);
      }
      //console.log(this.boardTasks);
      this.todoListTasks = this.boardTasks.filter((item:any) => item.listName == "To Do");
      this.inProgressListTasks = this.boardTasks.filter((item:any) => item.listName == "In Progress");
      this.codedListTasks = this.boardTasks.filter((item:any) => item.listName == "Coded");
      this.testingListTasks = this.boardTasks.filter((item:any) => item.listName == "Testing");
      this.doneListTasks = this.boardTasks.filter((item:any) => item.listName == "Done");
      //console.log(this.todoListTasks);
      //console.log(this.doneListTasks);
    });
  }

  ngOnInit(): void {
    //console.log(this.boardId);
  }

  ngDoCheck(): void {
    //console.log(this.boardId);
  }

  addTaskStatusToggle(listTitle: string) {
    if(listTitle == this.todoList) this.addTaskStatusTodoList = !this.addTaskStatusTodoList;
    if(listTitle == this.inProgressList) this.addTaskStatusProgressList = !this.addTaskStatusProgressList;
    if(listTitle == this.codedList) this.addTaskStatusCodedList = !this.addTaskStatusCodedList;
    if(listTitle == this.testingList) this.addTaskStatusTestingList = !this.addTaskStatusTestingList;
    if(listTitle == this.doneList) this.addTaskStatusDoneList = !this.addTaskStatusDoneList;

  }

  addTask(listName: string, taskTitle: string, taskText: string, formGroup: any) {

    this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, taskText)
      .subscribe((responseData: any) => {
        let newTask = new Task(responseData.body.listName, responseData.body.taskTitle, responseData.body.taskText, responseData.body.id);
        if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
        if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
        if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
        if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
        if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
      });
    formGroup.reset();

  }

  deleteTask(taskId: number) {
    console.log(taskId);
    this.taskService.deleteTask(taskId).subscribe((responseData: any) => {

      let newtodoListTasks = this.todoListTasks.filter((item: any) => item.taskId != responseData.body);
      this.todoListTasks = newtodoListTasks;

      let newInProgressListTasks = this.inProgressListTasks.filter((item: any) => item.taskId != responseData.body);
      this.inProgressListTasks = newInProgressListTasks;

      let newCodedListTasks = this.codedListTasks.filter((item: any) => item.taskId != responseData.body);
      this.codedListTasks = newCodedListTasks;

      let newTestingListTasks = this.testingListTasks.filter((item: any) => item.taskId != responseData.body);
      this.testingListTasks = newTestingListTasks;

      let newDoneListTasks = this.doneListTasks.filter((item: any) => item.taskId != responseData.body);
      this.doneListTasks = newDoneListTasks;

    });
  }

  renameTaskTitleOrText(taskId: number, taskTitle: any, taskText: any) {

    this.taskService.renameTask(taskId, taskTitle, taskText).subscribe((responseData: any) => {
      //console.log(responseData.body);
    });
  }

  deleteAllTasks(tasksArray: any) {
    if(confirm("Are you sure to delete all tasks?")) {
      let idsForDelete: any = [];
      tasksArray.forEach((item: any) => idsForDelete.push(item.taskId));
      this.taskService.deleteAllTasks(idsForDelete).subscribe((responseData: any) => {
        if (responseData.status == 200) {
          tasksArray.length = 0;
          //console.log(tasksArray);
        }
      });
    }
  }

  searchTask(taskTitle: string, formGroup: any) {
    this.taskService.searchTask(this.boardId, taskTitle).subscribe((responseData: any) => {
      let foundTasks = JSON.parse(responseData.body);
      this.foundTasks = foundTasks;
      console.log(this.foundTasks);
      console.log(this.foundTasks.length);

    });
    formGroup.reset();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
