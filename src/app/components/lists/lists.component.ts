import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {TaskService} from "../../services/task.service";
import {AfterViewInit, OnChanges, OnInit, DoCheck} from "@angular/core";
import {Task} from "../../interfaces/task";
import {Input} from '@angular/core';

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

  boardTasks: any = [];

  todoListTasks: any = [];
  inProgressListTasks: any = [];
  codedListTasks: any = [];
  testingListTasks: any = [];
  doneListTasks: any = [];

  @Input() boardId: number;

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
        let newTask = new Task(parseResponse[i].listName, parseResponse[i].taskTitle, parseResponse[i].taskText);
        this.boardTasks.push(newTask);
      }
      console.log(this.boardTasks);
      this.todoListTasks = this.boardTasks.filter((item:any) => item.listName == "To Do");
      this.inProgressListTasks = this.boardTasks.filter((item:any) => item.listName == "In Progress");
      this.codedListTasks = this.boardTasks.filter((item:any) => item.listName == "Coded");
      this.testingListTasks = this.boardTasks.filter((item:any) => item.listName == "Testing");
      this.doneListTasks = this.boardTasks.filter((item:any) => item.listName == "Done");
      console.log(this.todoListTasks);
    });
  }

  ngOnInit(): void {
    //console.log(this.boardId);
  }

  ngDoCheck(): void {
    //console.log(this.boardId);
  }

  // sortBoardTasks() {
  //   // if (this.boardTasks.length) {
  //   // for (let i = 0; i < this.boardTasks.length; i++) {
  //   //   if (this.boardTasks[i].listName == 'To do') {
  //   //     let newTask = new Task(this.boardTasks[i].listName, this.boardTasks[i].taskTitle, this.boardTasks[i].taskText);
  //   //     this.todoListTasks.push(newTask);
  //   //   }
  //   // }
  //   // }
  //
  //   this.boardTasks.forEach(function(item: any){
  //     let array: any = [];
  //     if (item.listName == "To Do") {
  //       let newTask = new Task(item.listName, item.taskTitle, item.taskText);
  //       array.push(newTask);
  //     }
  //   });
  //   console.log(this.todoListTasks);
  // }

  addTaskStatusToggle(listTitle: string) {
    if(listTitle == this.todoList) this.addTaskStatusTodoList = !this.addTaskStatusTodoList;
    if(listTitle == this.inProgressList) this.addTaskStatusProgressList = !this.addTaskStatusProgressList;
    if(listTitle == this.codedList) this.addTaskStatusCodedList = !this.addTaskStatusCodedList;
    if(listTitle == this.testingList) this.addTaskStatusTestingList = !this.addTaskStatusTestingList;
    if(listTitle == this.doneList) this.addTaskStatusDoneList = !this.addTaskStatusDoneList;

  }

  addTask(listName: string, taskTitle: string, taskText: string) {
    //console.log(this.workSpaceComponent.boardId);
    this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, taskText)
      .subscribe((responseData: any) => {
        // console.log(responseData);
        // console.log(responseData.body.taskText);
        let newTask = new Task(responseData.body.listName, responseData.body.taskTitle, responseData.body.taskText);
        this.boardTasks.push(newTask);
        console.log(this.boardTasks);
      });
  }

  loadTasks() {
    //console.log(this.workSpaceComponent.boardId);
  }

}
