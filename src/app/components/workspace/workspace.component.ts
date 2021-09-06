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

  boardId: number;

  newBoardName: string = '';

  boardLink: string = '';

  boardOwner: boolean;

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
          this.boardName = this.userBoards[0].boardName;
          this.boardId = this.userBoards[0].boardId;
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
    this.boardService.addBoard(this.createBoardForm.value.board).subscribe((responseData) => {
        let newBoard: newBoard = {boardName: responseData.body.boardName, boardId: responseData.body.id};

        this.userBoards.push(newBoard);
        this.selectNewBoard(responseData.body.id, responseData.body.boardName)
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
          this.selectNewBoard(this.userBoards[0].boardId, this.userBoards[0].boardName)}
        else {this.boardName = 'No boards'}

      },
        error => console.log(error));
    }
  };

  selectBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
    this.loadBoardRigth();
  };

  selectNewBoard(id: number, board: string) {
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
    if (this.boardId != undefined) {
      this.boardService.loadBoardRigth(this.boardId).subscribe((responseData) => {
          let responseParse = JSON.parse(responseData.body);
          this.boardOwner = responseParse.owner;
        },
        error => console.log(error));
    }
  };



}
