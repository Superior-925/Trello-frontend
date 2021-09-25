import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {BoardService} from "../../services/board.service";
import {AfterViewInit} from "@angular/core";
import {OnChanges} from "@angular/core";
import {OnInit} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {newBoard} from "../../interfaces/new-board";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})

export class WorkspaceComponent implements OnChanges, AfterViewInit, OnInit{

  createBoardForm : FormGroup;

  userBoards: newBoard[] = [];

  boardName: string = '';

  boardId: any;

  newBoardName: string = '';

  boardLink: string = '';

  boardOwner: boolean;

  boardTodoList: object;

  boardInProgressList: object;

  boardCodedList: object;

  boardTestingList: object;

  boardDoneList: object;

  noBoards: boolean;

  constructor(private boardService: BoardService, private authService: AuthService, private router: Router) {

    this.createBoardForm = new FormGroup({
      board: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit(): void {
    this.boardService.loadBoards().subscribe((responseData) => {
        this.userBoards.length = 0;
        let responseBoards = JSON.parse(responseData.body);
        for (let i = 0; i < responseBoards.length; i++) {
          let newBoard: newBoard = {boardName: responseBoards[i].boardName, boardId: responseBoards[i].id};
          this.userBoards.push(newBoard);
        }

        if (this.userBoards.length) {
          this.noBoards = false;
          this.boardName = this.userBoards[0].boardName;
          this.boardId = this.userBoards[0].boardId;
        }
        if (this.userBoards.length == 0) {
          this.noBoards = true;
        }
        this.loadBoardRigth();
      },
      error => console.log(error));
  };

  ngOnChanges(): void {
    this.userBoards =[];
    this.loadBoardRigth();
  };

  addBoard(){
    this.boardService.addBoard(this.createBoardForm.value.board).subscribe((responseData: any) => {
        this.noBoards = false;
        let newBoard: newBoard = {boardName: responseData.body.board.boardName, boardId: responseData.body.board.id};

        this.boardTodoList = responseData.body.listTodo;
        this.boardInProgressList = responseData.body.listInProgress;
        this.boardCodedList = responseData.body.listCoded;
        this.boardTestingList = responseData.body.listTesting;
        this.boardDoneList = responseData.body.listDone;

        this.userBoards.push(newBoard);
        this.selectNewBoard(responseData.body.board.id, responseData.body.board.boardName)
      },
      error => console.log(error));
    this.createBoardForm.reset();
  };

  renameBoard() {
    this.boardService.renameBoard(this.boardId, this.newBoardName).subscribe((responseData) => {
      this.userBoards.forEach(function(item: newBoard){
        if (item.boardId == responseData.body.id) {item.boardName = responseData.body.boardName}
      });
    },
      error => console.log(error));
  };

  deleteBoard() {

    if(confirm("Are you sure to delete board?")) {
      this.boardService.deleteBoard(this.boardId).subscribe((responseData) => {
        let filterUserBoards = this.userBoards.filter((item:newBoard) => item.boardId !== +responseData.body);
        this.userBoards = filterUserBoards;

        if (this.userBoards.length) {
          this.selectNewBoard(this.userBoards[0].boardId, this.userBoards[0].boardName)
        }
          if (this.userBoards.length == 0) {
            this.noBoards = true;
            this.selectNewBoard(-1, 'No boards')
          }
      },
        error => console.log(error));
    }
  };

  selectBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
    this.loadBoardRigth();
  };

  selectNewBoard(id: any, board: string) {
    this.boardName = board;
    this.boardId = id;
    this.loadBoardRigth();
  };

  inviteCreateLink($event: any) {
    $event.preventDefault();
    this.boardService.inviteCreateLink(this.boardId).subscribe((responseData) => {
      this.boardLink = responseData.body;
    },
      error => console.log(error));
  };

  loadBoardRigth() {
    if (this.boardId != undefined && this.boardId != -1) {
      this.boardService.loadBoardRigth(this.boardId).subscribe((responseData) => {
          this.boardOwner = responseData.body.owner;
        },
        error => console.log(error));
    }
  };
}
