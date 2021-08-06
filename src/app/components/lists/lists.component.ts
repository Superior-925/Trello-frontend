import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {TaskService} from "../../services/task.service";
import {BoardService} from "../../services/board.service";
import {AfterViewInit, OnChanges, OnInit, DoCheck} from "@angular/core";
import {Task} from "../../interfaces/task";
import {Executor} from "../../interfaces/executor";
import {Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnChanges, OnInit, DoCheck {

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

  closeResult: string;

  boardMembers: any = [];

  taskExecutors: any = [];

  archivedTasks: any = [];

  constructor(private taskService: TaskService, private boardService: BoardService, private modalService: NgbModal) {
    this.createTaskFormTodoList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormProgressList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormCodedList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormTestingList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
    this.createTaskFormDoneList = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
    this.searchTaskForm = new FormGroup({
      taskTitle: new FormControl('', [
        Validators.required
      ])
    });
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
      console.log(this.todoListTasks);
      //console.log(this.doneListTasks);
    });
    this.boardService.loadInvitedUsers(this.boardId).subscribe((responseData: any) => {
      this.boardMembers = JSON.parse(responseData.body);
      console.log(this.boardMembers);
    });
    this.taskService.loadExecutors(this.boardId).subscribe((responseData: any) => {
      let parseResponse = JSON.parse(responseData.body);
      console.log(this.taskExecutors);

      for (let i = 0; i < parseResponse.length; i++) {
        let newExecutor = new Executor(parseResponse[i].userId, parseResponse[i].userEmail, parseResponse[i].taskId);
        this.taskExecutors.push(newExecutor)
      }
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

  addTask(listName: string, taskTitle: string, formGroup: any) {

    this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle)
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
    if(confirm("Are you sure you want to delete all tasks in the list?")) {
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

  open(content:any) {
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  selectExecutor(taskId: number, userId: number, boardId: number) {

    let findExecutor = this.taskExecutors.find((item: any) => item.taskId == taskId && item.userId == userId);
    if (findExecutor) {return}
    else {
    this.taskService.selectExecutor(taskId, userId, boardId).subscribe((responseData: any) => {
      //console.log(this.taskExecutors);

      //console.log(findExecutor);
      let newExecutor = new Executor(responseData.body.user.id, responseData.body.user.email, responseData.body.task.id);
      this.taskExecutors.push(newExecutor);
      //console.log(this.taskExecutors);
    })
    }
  }

  deleteExecutor(taskId: number, userId: number) {
    this.taskService.deleteExecutor(taskId, userId).subscribe((responseData: any) => {
      // console.log(responseData.body);
      // console.log(this.taskExecutors);
      // console.log(responseData.body.taskexecutor.userId);
      let newExecutorsArray = this.taskExecutors.filter((item:any) => item.taskId == responseData.body.taskexecutor.taskId && item.userId != responseData.body.taskexecutor.userId);
      this.taskExecutors = newExecutorsArray;
    });
  }

  archiveTasks(tasksArray: any) {
    if(confirm("Are you sure you want to archive all the tasks in the list?")) {
      console.log(tasksArray);
      let idsForArchive: any = [];
      tasksArray.forEach((item: any) => idsForArchive.push(item.taskId));
      this.taskService.archiveTasks(idsForArchive).subscribe((responseData: any) => {
        if (responseData.status == 200) {
          tasksArray.length = 0;
        }
      });
    }
  }

  showArchivedTasks() {
      this.taskService.loadArchivedTasks(this.boardId).subscribe((responseData: any) => {
        console.log(JSON.parse(responseData.body));

        let parseResponse = JSON.parse(responseData.body);
        this.archivedTasks.length = 0;
        for (let i = 0; i < parseResponse.length; i++) {
          let newTask = new Task(parseResponse[i].listName, parseResponse[i].taskTitle, parseResponse[i].taskText, parseResponse[i].id);
          this.archivedTasks.push(newTask);
        }
      });
  }

  restoreTasks(listName: string) {
    //console.log(this.archivedTasks);
    let restoreTasksArray: any = [];
    this.archivedTasks.forEach((item: any) => restoreTasksArray.push(item.taskId));
    //console.log(restoreTasksArray);
    this.taskService.restoreTasks(listName, restoreTasksArray, this.boardId).subscribe((responseData: any) => {
      console.log(responseData.body);
      let responseBody = responseData.body;
      responseBody.forEach((item: any) => {
        let newTask = new Task(item.listName, item.taskTitle, item.taskText, item.id);
        if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
        if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
        if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
        if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
        if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
      });

    });
  }

}


