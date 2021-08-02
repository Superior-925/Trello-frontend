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

  createBoardForm : FormGroup;

  userBoards: any = [];

  boardName: string = '';

  boardId: number;

  newBoardName: string = '';

  boardLink: string = '';

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
        if (this.userBoards.length) {
          this.boardName = this.userBoards[0].boardName;
          this.boardId = this.userBoards[0].boardId;
        }
        // console.log(this.userBoards);
        // console.log(this.boardId);
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
    this.createBoardForm.reset();
  }

  renameBoard() {
    this.boardService.renameBoard(this.boardId, this.newBoardName).subscribe((responseData: any) => {
      this.userBoards.forEach(function(item: any){
        if (item.boardId == responseData.body.id) {item.boardName = responseData.body.boardName}
      });
    });
  }

  deleteBoard() {

    if(confirm("Are you sure to delete board?")) {
      this.boardService.deleteBoard(this.boardId).subscribe((responseData: any) => {
        let filterUserBoards = this.userBoards.filter((item:any) => item.boardId !== responseData.body);
        this.userBoards = filterUserBoards;
        if (this.userBoards.length) {
        this.boardName = this.userBoards[0].boardName;}
        else {this.boardName = 'No boards'}
      });
    }
  }

  selectBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
  }

  inviteCreateLink($event: any) {
    $event.preventDefault();
    this.boardService.inviteCreateLink(this.boardId).subscribe((responseData: any) => {
      this.boardLink = responseData.body;
    });

  }
}
