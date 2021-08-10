import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {TaskService} from "../../services/task.service";
import {BoardService} from "../../services/board.service";
import {OnChanges} from "@angular/core";
import {Task} from "../../interfaces/task";
import {Executor} from "../../interfaces/executor";
import {Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnChanges{

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

  taskActions: any = [];

  boardOwner: boolean;

  userId: any = localStorage.getItem('userId');

  constructor(private taskService: TaskService, private boardService: BoardService, private modalService: NgbModal, private router: Router) {
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

    this.taskService.loadTasks(this.boardId).subscribe((responseData: any) => {

      let parseResponse = JSON.parse(responseData.body);
      for (let i = 0; i < parseResponse.length; i++) {
        let newTask = new Task(parseResponse[i].listName, parseResponse[i].taskTitle, parseResponse[i].taskText, parseResponse[i].id);
        this.boardTasks.push(newTask);
      }
      this.todoListTasks = this.boardTasks.filter((item:any) => item.listName == "To Do");
      this.inProgressListTasks = this.boardTasks.filter((item:any) => item.listName == "In Progress");
      this.codedListTasks = this.boardTasks.filter((item:any) => item.listName == "Coded");
      this.testingListTasks = this.boardTasks.filter((item:any) => item.listName == "Testing");
      this.doneListTasks = this.boardTasks.filter((item:any) => item.listName == "Done");

    },
      error => console.log(error));
    this.boardService.loadInvitedUsers(this.boardId).subscribe((responseData: any) => {
      this.boardMembers = JSON.parse(responseData.body);
    },
      error => console.log(error));
    this.taskService.loadExecutors(this.boardId).subscribe((responseData: any) => {
      let parseResponse = JSON.parse(responseData.body);
      this.taskExecutors.length = 0;
      for (let i = 0; i < parseResponse.length; i++) {
        let newExecutor = new Executor(parseResponse[i].userId, parseResponse[i].userEmail, parseResponse[i].taskId);
        this.taskExecutors.push(newExecutor)
      }
    },
      error => console.log(error));
    this.loadBoardRigths();
  };

  addTaskStatusToggle(listTitle: string) {
    if(listTitle == this.todoList) this.addTaskStatusTodoList = !this.addTaskStatusTodoList;
    if(listTitle == this.inProgressList) this.addTaskStatusProgressList = !this.addTaskStatusProgressList;
    if(listTitle == this.codedList) this.addTaskStatusCodedList = !this.addTaskStatusCodedList;
    if(listTitle == this.testingList) this.addTaskStatusTestingList = !this.addTaskStatusTestingList;
    if(listTitle == this.doneList) this.addTaskStatusDoneList = !this.addTaskStatusDoneList;
  };

  addTask(listName: string, taskTitle: string, formGroup: any) {
    this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle)
      .subscribe((responseData: any) => {
        let newTask = new Task(responseData.body.listName, responseData.body.taskTitle, responseData.body.taskText, responseData.body.id);
        if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
        if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
        if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
        if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
        if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
      },
        error => console.log(error));
    formGroup.reset();
  };

  deleteTask(taskId: number) {

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

    },
      error => console.log(error));
  };

  renameTaskTitleOrText(taskId: number, taskTitle: any, taskText: any) {

    this.taskService.renameTask(taskId, taskTitle, taskText).subscribe((responseData: any) => {
    },
      error => console.log(error));
  };

  deleteAllTasks(tasksArray: any) {
    if(confirm("Are you sure you want to delete all tasks in the list?")) {
      let idsForDelete: any = [];
      tasksArray.forEach((item: any) => idsForDelete.push(item.taskId));
      this.taskService.deleteAllTasks(idsForDelete).subscribe((responseData: any) => {
        if (responseData.status == 200) {
          tasksArray.length = 0;
        }
      },
        error => console.log(error));
    }
  };

  searchTask(taskTitle: string, formGroup: any) {
    this.taskService.searchTask(this.boardId, taskTitle).subscribe((responseData: any) => {
      let foundTasks = JSON.parse(responseData.body);
      this.foundTasks = foundTasks;
    },
      error => console.log(error));
    formGroup.reset();
  };

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  };

  open(content:any) {
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  };

  selectExecutor(taskId: number, userId: number, boardId: number) {

    let findExecutor = this.taskExecutors.find((item: any) => item.taskId == taskId && item.userId == userId);
    if (findExecutor) {return}
    else {
    this.taskService.selectExecutor(taskId, userId, boardId).subscribe((responseData: any) => {
      let newExecutor = new Executor(responseData.body.user.id, responseData.body.user.email, responseData.body.task.id);
      this.taskExecutors.push(newExecutor);
    },
      error => console.log(error))
    }
  };

  deleteExecutor(taskId: number, userId: number) {
    this.taskService.deleteExecutor(taskId, userId).subscribe((responseData: any) => {
      for(let i = 0; i < this.taskExecutors.length; i++) {
        if(this.taskExecutors[i].taskId == responseData.body.taskexecutor.taskId && this.taskExecutors[i].userId == responseData.body.taskexecutor.userId) {
          this.taskExecutors.splice(i, 1);
          break;
        }
      }
    },
      error => console.log(error));
  };

  archiveTasks(tasksArray: any) {
    if(confirm("Are you sure you want to archive all the tasks in the list?")) {
      let idsForArchive: any = [];
      tasksArray.forEach((item: any) => idsForArchive.push(item.taskId));
      this.taskService.archiveTasks(idsForArchive).subscribe((responseData: any) => {
        if (responseData.status == 200) {
          tasksArray.length = 0;
        }
      },
        error => console.log(error));
    }
  };

  showArchivedTasks() {
      this.taskService.loadArchivedTasks(this.boardId).subscribe((responseData: any) => {

        let parseResponse = JSON.parse(responseData.body);
        this.archivedTasks.length = 0;
        for (let i = 0; i < parseResponse.length; i++) {
          let newTask = new Task(parseResponse[i].listName, parseResponse[i].taskTitle, parseResponse[i].taskText, parseResponse[i].id);
          this.archivedTasks.push(newTask);
        }
      },
        error => console.log(error));
  };

  restoreTasks(listName: string) {
    let restoreTasksArray: any = [];
    this.archivedTasks.forEach((item: any) => restoreTasksArray.push(item.taskId));
    this.taskService.restoreTasks(listName, restoreTasksArray, this.boardId).subscribe((responseData: any) => {
      let responseBody = responseData.body;
      responseBody.forEach((item: any) => {
        let newTask = new Task(item.listName, item.taskTitle, item.taskText, item.id);
        if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
        if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
        if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
        if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
        if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
      });

    },
      error => console.log(error));
  };

  loadBoardRigths() {
    this.taskService.loadBoardRigths(this.boardId).subscribe((responseData: any) => {
      let responseParse = JSON.parse(responseData.body);
      this.boardOwner = responseParse.owner;
    },
      error => console.log(error))
  };

  loadActionsOfTasks() {
    this.taskService.loadActionsOfTasks(this.boardId).subscribe((responseData: any) => {
      this.taskActions.length = 0;
      this.taskActions = JSON.parse(responseData.body);
    },
      error => console.log(error));
  };

  logOut() {
    if(confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      this.router.navigate(['/home']);
    }
  };

}


