import { Component, OnInit } from '@angular/core';
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

  createBoardForm : FormGroup;

  // userBoards: any = [{name: 'Number one', id: 3}, {name: 'Top board', id: 5}, {name: 'Other board', id: 8}];

  userBoards: any = [];

  boardName: string = '';

  boardId: number = 0;

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
        //console.log(this.userBoards);
      },
      error => console.log(error));
  }

  ngOnChanges(): void {
    this.userBoards =[];
  }

  addBoard(){
    this.boardService.addBoard(this.createBoardForm.value.board).subscribe((responseData: any) => {
        //console.log(responseData);
        let newBoard = new Board(responseData.body.boardName, responseData.body.id);
        this.userBoards.push(newBoard);
        console.log(this.userBoards);
      },
      error => console.log(error));
  }

  renameBoard() {
    this.boardService.loadBoards();
  }

  deleteBoard(id: number) {
    this.boardService.deleteBoard(id).subscribe();
    if(confirm("Are you sure to delete board?")) {
      console.log("Implement delete functionality here");
    }
    console.log(id);
  }

  selectBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
    //console.log("Board id = " + id, "Board name = " + board);

  }

}
