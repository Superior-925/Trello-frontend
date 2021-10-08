import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {TaskService} from "../../services/task.service";
import {BoardService} from "../../services/board.service";
import {OnChanges} from "@angular/core";
import {Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {newTask} from '../../interfaces/new-task'
import {taskExecutor} from "../../interfaces/task-executor";
import {newInvitedUser} from "../../interfaces/new-invited-user";
import {newExecutor} from "../../interfaces/new-executor";
import {newAction} from "../../interfaces/new-action";
import {newFoundTask} from "../../interfaces/new-found-task";
import {boardList} from "../../interfaces/board-list";

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

  boardTasks: newTask[] = [];

  todoListTasks: newTask[] = [];
  inProgressListTasks: newTask[] = [];
  codedListTasks: newTask[] = [];
  testingListTasks: newTask[] = [];
  doneListTasks: newTask[] = [];

  @Input() boardId: any;

  boardTodoList: boardList;
  boardInProgressList: boardList;
  boardCodedList: boardList;
  boardTestingList: boardList;
  boardDoneList: boardList;

  foundTasks: newFoundTask[] = [];

  closeResult: string;

  boardMembers: newInvitedUser[] = [];

  taskExecutors: taskExecutor[] = [];

  archivedTasks: newTask[] = [];

  taskActions: newAction[] = [];

  boardOwner: boolean;

  showHideTitleOptions: boolean = true;

  userId: any = localStorage.getItem('userId');

  constructor(private taskService: TaskService, private boardService: BoardService, private modalService: NgbModal, private router: Router, private authService: AuthService) {
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

  sortTasks(taskArray: newTask[]) {
    taskArray.sort( ( a: newTask, b: newTask) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    })
  }

  ngOnChanges(): void {

    this.boardTasks =[];

    this.addTaskStatusTodoList = true;
    this.addTaskStatusProgressList = true;
    this.addTaskStatusCodedList = true;
    this.addTaskStatusTestingList = true;
    this.addTaskStatusDoneList = true;

    if (this.boardId != undefined && this.boardId != -1) {
      this.loadLists();
    }

    if (this.boardId != undefined) {

      if (this.boardId == -1) {
        this.todoListTasks.length = 0;
        this.inProgressListTasks.length = 0;
        this.codedListTasks.length = 0;
        this.testingListTasks.length = 0;
        this.doneListTasks.length = 0;

        this.addTaskStatusTodoList = true;
        this.addTaskStatusProgressList = true;
        this.addTaskStatusCodedList = true;
        this.addTaskStatusTestingList = true;
        this.addTaskStatusDoneList = true;
      }

      if (this.boardId != -1) {
        this.taskService.loadTasks(this.boardId).subscribe((responseData) => {

            responseData.forEach((list) => {
              list.tasks.forEach((task) => {
                let newTask: newTask = {listName: list.listName, listId: list.id, taskTitle: task.taskTitle, taskText: task.taskText, taskId: task.id, order: task.order};
                this.boardTasks.push(newTask)
              })
            });

            this.todoListTasks = this.boardTasks.filter((item:newTask) => item.listName == "To Do");
            this.sortTasks(this.todoListTasks);

            this.inProgressListTasks = this.boardTasks.filter((item:newTask) => item.listName == "In Progress");
            this.sortTasks(this.inProgressListTasks);

            this.codedListTasks = this.boardTasks.filter((item:newTask) => item.listName == "Coded");
            this.sortTasks(this.codedListTasks);

            this.testingListTasks = this.boardTasks.filter((item:newTask) => item.listName == "Testing");
            this.sortTasks(this.testingListTasks);

            this.doneListTasks = this.boardTasks.filter((item:newTask) => item.listName == "Done");
            this.sortTasks(this.doneListTasks);

          },
          error => console.log(error));
      }
    }

    if (this.boardId != undefined && this.boardId != -1) {
      this.boardService.loadInvitedUsers(this.boardId).subscribe((responseData) => {
          this.boardMembers.length = 0;
          let responseInvitedUsers = JSON.parse(responseData.body);

          for (let i = 0; i < responseInvitedUsers.length; i++) {
            let newInvitedUser: newInvitedUser = {userId: responseInvitedUsers[i].id, userEmail: responseInvitedUsers[i].email};
            this.boardMembers.push(newInvitedUser);
          }
        },
        error => console.log(error));
    }

    if (this.boardId != undefined && this.boardId != -1) {
      this.taskService.loadExecutors(this.boardId).subscribe((responseData) => {
          this.taskExecutors.length = 0;
          responseData.body.forEach((list) => {
            list.tasks.forEach((task) => {
              task.users.forEach((user) => {
                let newExecutor: taskExecutor = {userId: user.id, userEmail: user.email, taskId: task.id};
                this.taskExecutors.push(newExecutor);
              });
            })
          });
        },
        error => console.log(error));
    }

    if (this.boardId != undefined && this.boardId != -1) {
      this.loadBoardRigths();
    }
  };

  loadLists() {
    this.boardService.loadLists(this.boardId).subscribe((responseData) => {

      responseData.forEach((item: boardList) => {
        if (item.listName == 'To Do') {
          this.boardTodoList = item;
        }
        if (item.listName == 'In Progress') {
          this.boardInProgressList = item;
        }
        if (item.listName == 'Coded') {
          this.boardCodedList = item;
        }
        if (item.listName == 'Testing') {
          this.boardTestingList = item;
        }
        if (item.listName == 'Done') {
          this.boardDoneList = item;
        }
      });
    })
  }

  addTaskStatusToggle(listTitle: string) {
    if(listTitle == this.todoList) this.addTaskStatusTodoList = !this.addTaskStatusTodoList;
    if(listTitle == this.inProgressList) this.addTaskStatusProgressList = !this.addTaskStatusProgressList;
    if(listTitle == this.codedList) this.addTaskStatusCodedList = !this.addTaskStatusCodedList;
    if(listTitle == this.testingList) this.addTaskStatusTestingList = !this.addTaskStatusTestingList;
    if(listTitle == this.doneList) this.addTaskStatusDoneList = !this.addTaskStatusDoneList;
  };

  addTask(listName: string, taskTitle: string, formGroup: any) {

    if (listName == "To Do") {
      let order = this.todoListTasks.length + 1;

      this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, order, this.boardTodoList.id)
        .subscribe((responseData) => {
            let newTask: newTask = {listName: responseData.list.listName, listId: responseData.list.id, taskTitle: responseData.taskTitle, taskText: responseData.taskText, taskId: responseData.id, order: responseData.order};
            if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
            if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
            if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
            if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
            if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
          },
          error => console.log(error));
    }

    if (listName == "In Progress") {
      let order = this.inProgressListTasks.length + 1;

      this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, order, this.boardInProgressList.id)
        .subscribe((responseData) => {
            let newTask: newTask = {listName: responseData.list.listName, listId: responseData.list.id, taskTitle: responseData.taskTitle, taskText: responseData.taskText, taskId: responseData.id, order: responseData.order};
            if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
            if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
            if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
            if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
            if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
          },
          error => console.log(error));

    }

    if (listName == "Coded") {
      let order = this.codedListTasks.length + 1;

      this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, order, this.boardCodedList.id)
        .subscribe((responseData) => {
            let newTask: newTask = {listName: responseData.list.listName, listId: responseData.list.id, taskTitle: responseData.taskTitle, taskText: responseData.taskText, taskId: responseData.id, order: responseData.order};
            if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
            if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
            if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
            if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
            if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
          },
          error => console.log(error));
    }

    if (listName == "Testing") {
      let order = this.testingListTasks.length + 1;

      this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, order, this.boardTestingList.id)
        .subscribe((responseData) => {
            let newTask: newTask = {listName: responseData.list.listName, listId: responseData.list.id, taskTitle: responseData.taskTitle, taskText: responseData.taskText, taskId: responseData.id, order: responseData.order};
            if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
            if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
            if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
            if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
            if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
          },
          error => console.log(error));
    }

    if (listName == "Done") {
      let order = this.doneListTasks.length + 1;

      this.taskService.addTask(localStorage.getItem('userId') as string, this.boardId, listName, taskTitle, order, this.boardDoneList.id)
        .subscribe((responseData) => {
            let newTask: newTask = {listName: responseData.list.listName, listId: responseData.list.id, taskTitle: responseData.taskTitle, taskText: responseData.taskText, taskId: responseData.id, order: responseData.order};
            if (newTask.listName == "To Do") {this.todoListTasks.push(newTask)}
            if (newTask.listName == "In Progress") {this.inProgressListTasks.push(newTask)}
            if (newTask.listName == "Coded") {this.codedListTasks.push(newTask)}
            if (newTask.listName == "Testing") {this.testingListTasks.push(newTask)}
            if (newTask.listName == "Done") {this.doneListTasks.push(newTask)}
          },
          error => console.log(error));
    }

    formGroup.reset();
  };

  deleteTask(taskId: number) {
    if(confirm("Are you sure you want to delete the task in the list?")) {
      this.taskService.deleteTask(taskId).subscribe((responseData) => {

          let newtodoListTasks = this.todoListTasks.filter((item: newTask) => item.taskId != responseData.body);
          this.todoListTasks = newtodoListTasks;

          let newInProgressListTasks = this.inProgressListTasks.filter((item: newTask) => item.taskId != responseData.body);
          this.inProgressListTasks = newInProgressListTasks;

          let newCodedListTasks = this.codedListTasks.filter((item: newTask) => item.taskId != responseData.body);
          this.codedListTasks = newCodedListTasks;

          let newTestingListTasks = this.testingListTasks.filter((item: newTask) => item.taskId != responseData.body);
          this.testingListTasks = newTestingListTasks;

          let newDoneListTasks = this.doneListTasks.filter((item: newTask) => item.taskId != responseData.body);
          this.doneListTasks = newDoneListTasks;

        },
        error => console.log(error));
    }
  };

  renameTaskTitleOrText(taskId: number, taskTitle: string | null, taskText: string | null) {

    this.taskService.renameTask(taskId, taskTitle, taskText).subscribe((responseData) => {
        if (responseData.status == 200) {
          this.loadActionsOfTasks();
        }
    },
      error => console.log(error));
  };

  deleteAllTasks(tasksArray: newTask[]) {
    if(confirm("Are you sure you want to delete all tasks in the list?")) {
      let idsForDelete: number[] = [];
      tasksArray.forEach((item: newTask) => idsForDelete.push(item.taskId));
      this.taskService.deleteAllTasks(idsForDelete).subscribe((responseData) => {
        if (responseData.status == 200) {
          tasksArray.length = 0;
        }
      },
        error => console.log(error));
    }
  };

  searchTask(taskTitle: string, formGroup: any) {
    this.taskService.searchTask(this.boardId, taskTitle).subscribe((responseData) => {
        this.foundTasks.length = 0;
        responseData.body.forEach((list) => {
          list.tasks.forEach((task) => {
            let newFoundTask: newFoundTask = {listName: list.listName, taskTitle: task.taskTitle, taskText: task.taskText, id: task.id, order: task.order};
            this.foundTasks.push(newFoundTask);
          });
        });
    },
      error => console.log(error));
    formGroup.reset();
  };

  drop(event: any, listName: string) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      if(listName == 'To Do') {
        this.todoListTasks.forEach((task: newTask, index: number) => {
        const idx = index + 1;
        if (task.order !== idx) {
          task.order = idx;
          this.taskOrder(task.taskId, task.order, 'To Do')
        }
      });
      }

      if(listName == 'In Progress') {
        this.inProgressListTasks.forEach((task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order !== idx) {
            task.order = idx;
            this.taskOrder(task.taskId, task.order, 'In progress')
          }
        });
      }

      if(listName == 'Coded') {
        this.codedListTasks.forEach((task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order !== idx) {
            task.order = idx;
            this.taskOrder(task.taskId, task.order, 'Coded')
          }
        });
      }

      if(listName == 'Testing') {
        this.testingListTasks.forEach((task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order !== idx) {
            task.order = idx;
            this.taskOrder(task.taskId, task.order, 'Testing')
          }
        });
      }

      if(listName == 'Done') {
        this.doneListTasks.forEach((task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order !== idx) {
            task.order = idx;
            this.taskOrder(task.taskId, task.order, 'Done')
          }
        });
      }

    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      if(listName == 'To Do') {
        this.todoListTasks.forEach( (task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order === idx && task.listName === 'To Do') {
            return
          }
          if (task.order !== idx) {
            task.order = idx
          }
          if (task.listName !== 'To Do') {

            task.listName = 'To Do';
          }
          this.changeTaskList(task, task.taskId, this.boardTodoList.id);
        });
      }

      if(listName == 'In Progress') {
        this.inProgressListTasks.forEach( (task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order === idx && task.listName === 'In Progress') {
            return
          }
          if (task.order !== idx) {
            task.order = idx
          }
          if (task.listName !== 'In Progress') {

            task.listName = 'In Progress';

          }
          this.changeTaskList(task, task.taskId, this.boardInProgressList.id);
        });
      }

      if(listName == 'Coded') {
        this.codedListTasks.forEach( (task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order === idx && task.listName === 'Coded') {
            return
          }
          if (task.order !== idx) {
            task.order = idx
          }
          if (task.listName !== 'Coded') {

            task.listName = 'Coded';
          }
          this.changeTaskList(task, task.taskId, this.boardCodedList.id);
        });
      }

      if(listName == 'Testing') {
        this.testingListTasks.forEach( (task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order === idx && task.listName === 'Testing') {
            return
          }
          if (task.order !== idx) {
            task.order = idx
          }
          if (task.listName !== 'Testing') {

            task.listName = 'Testing';
          }
          this.changeTaskList(task, task.taskId, this.boardTestingList.id);
        });
      }

      if(listName == 'Done') {
        this.doneListTasks.forEach( (task: newTask, index: number) => {
          const idx = index + 1;
          if (task.order === idx && task.listName === 'Done') {
            return
          }
          if (task.order !== idx) {
            task.order = idx
          }
          if (task.listName !== 'Done') {

            task.listName = 'Done';
          }
          this.changeTaskList(task, task.taskId, this.boardDoneList.id);
        });
      }

    }
  };

  taskOrder(taskId: number, taskOrder: number, listName: string) {
    this.taskService.taskOrder(taskId, taskOrder).subscribe((responseData: any) => {

    },
      error => console.log(error));
  }

  changeTaskList(task: newTask, taskId: number, listId: number) {

    this.taskService.taskChangeList(task, taskId, listId).subscribe((responseData: any) => {

    },
      error => console.log(error));
  }

  open(content:any) {
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  popoverTask(event: any) {
    event.stopPropagation();

  }

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
    let findExecutor = this.taskExecutors.find((item: newExecutor) => item.taskId == taskId && item.userId == userId);
    if (findExecutor) {return}
    else {
    this.taskService.selectExecutor(taskId, userId, boardId).subscribe((responseData) => {
        let newExecutor: newExecutor = {userId: responseData.body.user.id, userEmail: responseData.body.user.email, taskId: responseData.body.task.id};
        this.taskExecutors.push(newExecutor);
        this.loadActionsOfTasks();
    },
      error => console.log(error))
    }
  };

  deleteExecutor(taskId: number, userId: number) {
    this.taskService.deleteExecutor(taskId, userId).subscribe((responseData) => {
          for(let i = 0; i < this.taskExecutors.length; i++) {
        if(this.taskExecutors[i].taskId == responseData.body.taskId && this.taskExecutors[i].userId == responseData.body.userId) {
          this.taskExecutors.splice(i, 1);
          break;
        }
      }
        this.loadActionsOfTasks();
    },
      error => console.log(error));
  };

  archiveTasks(tasksArray: newTask[]) {
    if(confirm("Are you sure you want to archive all the tasks in the list?")) {
      let idsForArchive: number[] = [];
      tasksArray.forEach((item: newTask) => idsForArchive.push(item.taskId));
      this.taskService.archiveTasks(idsForArchive).subscribe((responseData) => {
        if (responseData.status == 200) {
          tasksArray.length = 0;
          this.archivedTasks.length = 0;
        }
      },
        error => console.log(error));
    }
  };

  archiveSingleTask(taskArray: newTask[], taskId: number) {
    this.taskService.archiveSingleTask(taskId).subscribe((responseData) => {
        if (responseData.status == 200) {
          let parseResponse = JSON.parse(responseData.body);
          const index = taskArray.findIndex((item: newTask) => item.taskId === parseResponse.id);
          if (index !== -1) {
            taskArray.splice(index, 1);
          }
        }
      },
      error => console.log(error));
  }


  showArchivedTasks() {
      this.taskService.loadArchivedTasks(this.boardId).subscribe((responseData) => {

        let parseResponse = JSON.parse(responseData.body);
        this.archivedTasks.length = 0;
          parseResponse.forEach((list: any) => {
            list.tasks.forEach((task: any) => {
              let newTask: newTask = {listName: list.listName, listId: list.id, taskTitle: task.taskTitle, taskText: task.taskText, taskId: task.id, order: task.order};
              this.archivedTasks.push(newTask);
            })
          })
      },
        error => console.log(error));
  };

  restoreTasks(listId: number) {
    let restoreTasksArray: number[] = [];
    this.archivedTasks.forEach((item: newTask) => restoreTasksArray.push(item.taskId));
    this.taskService.restoreTasks(listId, restoreTasksArray, this.boardId).subscribe((responseData) => {
        responseData.body.forEach((item) => {
        this.archivedTasks.length = 0;

        if (item.listId === this.boardTodoList.id) {
          let newTask: newTask = {listName: this.boardTodoList.listName, listId: item.listId, taskTitle: item.taskTitle, taskText: item.taskText, taskId: item.id, order: item.order};
          this.todoListTasks.push(newTask);
        }

          if (item.listId === this.boardInProgressList.id) {
            let newTask: newTask = {listName: this.boardInProgressList.listName, listId: item.listId, taskTitle: item.taskTitle, taskText: item.taskText, taskId: item.id, order: item.order};
            this.inProgressListTasks.push(newTask);
          }

          if (item.listId === this.boardCodedList.id) {
            let newTask: newTask = {listName: this.boardCodedList.listName, listId: item.listId, taskTitle: item.taskTitle, taskText: item.taskText, taskId: item.id, order: item.order};
            this.codedListTasks.push(newTask);
          }

          if (item.listId === this.boardTestingList.id) {
            let newTask: newTask = {listName: this.boardTestingList.listName, listId: item.listId, taskTitle: item.taskTitle, taskText: item.taskText, taskId: item.id, order: item.order};
            this.testingListTasks.push(newTask);
          }

          if (item.listId === this.boardDoneList.id) {
            let newTask: newTask = {listName: this.boardTestingList.listName, listId: item.listId, taskTitle: item.taskTitle, taskText: item.taskText, taskId: item.id, order: item.order};
            this.doneListTasks.push(newTask);
          }
      });

    },
      error => console.log(error));
  };

  restoreSingleTask (listName: string, taskId: number) {
    this.taskService.restoreSingleTask(taskId).subscribe((responseData) => {
      if (responseData.status == 200) {

          if (responseData.body.listId === this.boardTodoList.id) {
            let newTask: newTask = {listName: this.boardTodoList.listName, listId: responseData.body.listId, taskTitle: responseData.body.taskTitle, taskText: responseData.body.taskText, taskId: responseData.body.id, order: responseData.body.order};
            this.todoListTasks.push(newTask);
          }

          if (responseData.body.listId === this.boardInProgressList.id) {
            let newTask: newTask = {listName: this.boardInProgressList.listName, listId: responseData.body.listId, taskTitle: responseData.body.taskTitle, taskText: responseData.body.taskText, taskId: responseData.body.id, order: responseData.body.order};
            this.inProgressListTasks.push(newTask);
          }

          if (responseData.body.listId === this.boardCodedList.id) {
            let newTask: newTask = {listName: this.boardCodedList.listName, listId: responseData.body.listId, taskTitle: responseData.body.taskTitle, taskText: responseData.body.taskText, taskId: responseData.body.id, order: responseData.body.order};
            this.codedListTasks.push(newTask);
          }

          if (responseData.body.listId === this.boardTestingList.id) {
            let newTask: newTask = {listName: this.boardTestingList.listName, listId: responseData.body.listId, taskTitle: responseData.body.taskTitle, taskText: responseData.body.taskText, taskId: responseData.body.id, order: responseData.body.order};
            this.testingListTasks.push(newTask);
          }

          if (responseData.body.listId === this.boardDoneList.id) {
            let newTask: newTask = {listName: this.boardTestingList.listName, listId: responseData.body.listId, taskTitle: responseData.body.taskTitle, taskText: responseData.body.taskText, taskId: responseData.body.id, order: responseData.body.order};
            this.doneListTasks.push(newTask);
          }

        const index = this.archivedTasks.findIndex((item: newTask) => item.taskId === responseData.body.id);
        if (index !== -1) {
          this.archivedTasks.splice(index, 1);
        }
      }
    })
  }

  loadBoardRigths() {
    this.taskService.loadBoardRigths(this.boardId).subscribe((responseData) => {
        this.boardOwner = responseData.body.owner;
    },
      error => console.log(error))
  };

  loadActionsOfTasks() {
    this.taskService.loadActionsOfTasks(this.boardId).subscribe((responseData: any) => {

        let parseResp = (JSON.parse(responseData.body));
        this.taskActions.length = 0;
        parseResp.forEach((list: any) => {
          list.tasks.forEach((task: any) => {
            task.taskactions.forEach((action: any) => {
              let newAction: newAction = {taskId: task.id, taskTitle: task.taskTitle, action: action.action, updatedAt: action.updatedAt};
              this.taskActions.push(newAction);
            })
          })
        });
    },
      error => console.log(error));
  };

  logOut() {
    if(confirm("Are you sure you want to log out?")) {
      this.authService.logOut().subscribe((responseData) => {
        this.authService.stopRefresh();
        if (responseData.status == 200) {localStorage.clear();
          this.router.navigate(['/home']);}
      });
    }
  };

  showHideTitleOptionsFunction () {
    this.showHideTitleOptions = !this.showHideTitleOptions;
  }

  showHideTitleOptionsTrue () {
    this.showHideTitleOptions = true;
  }

}


