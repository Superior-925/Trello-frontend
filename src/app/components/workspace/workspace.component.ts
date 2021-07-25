import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {BoardService} from "../../services/board.service";
import {AuthService} from "../../services/auth.service";
import {AfterViewInit} from "@angular/core";
import {OnChanges} from "@angular/core";
import {Board} from "../../interfaces/board";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})

export class WorkspaceComponent implements OnChanges, AfterViewInit{

  //@Input() label: string;

  createBoardForm : FormGroup;

  //renameBoardForm: FormGroup;

  // userBoards: any = [{name: 'Number one', id: 3}, {name: 'Top board', id: 5}, {name: 'Other board', id: 8}];

  userBoards: any = [];

  boardName: string = '';

  boardId: number = 0;

  renBoardStatus: boolean = false;

  newBoardName: string = '';

  constructor(private boardService: BoardService, private authService: AuthService) {
    this.createBoardForm = new FormGroup({
      board: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngAfterViewInit(): void {
    this.boardService.loadBoards().subscribe((responseData: any) => {
        this.userBoards = JSON.parse(responseData.body);
        this.boardName = this.userBoards[0].boardName;
      },
      error => console.log(error));
  }

  ngOnChanges(): void {
    this.userBoards =[];
  }

  addBoard(){
    this.boardService.addBoard(this.createBoardForm.value.board).subscribe((responseData: any) => {
        let newBoard = new Board(responseData.body.boardName, responseData.body.id);
        this.userBoards.push(newBoard);
        console.log(this.userBoards);
      },
      error => console.log(error));
  }

  renameBoard() {
    this.boardService.renameBoard(this.boardId, this.newBoardName).subscribe();
    this.renBoardStatus = !this.renBoardStatus;
    console.log(this.renBoardStatus);
    console.log(this.newBoardName);
  }

  deleteBoard() {

    if(confirm("Are you sure to delete board?")) {
      this.boardService.deleteBoard(this.boardId).subscribe((responseData: any) => {
        let filterUserBoards = this.userBoards.filter((item:any) => item.boardId !== responseData.body);
        this.userBoards = filterUserBoards;
        this.boardName = this.userBoards[0].boardName;
      });
    }
  }

  selectBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
    //console.log("Board id = " + id, "Board name = " + board);
  }

}
