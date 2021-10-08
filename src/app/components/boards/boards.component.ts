import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BoardService} from "../../services/board.service";
import {Router} from "@angular/router";
import {newBoard} from "../../interfaces/new-board";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  createBoardForm : FormGroup;

  userBoards: newBoard[] = [];

  constructor(private router: Router, private boardService: BoardService, private authService: AuthService) {
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
    if (localStorage.getItem('token')) {
      this.authService.startRefresh();
      this.boardService.loadBoards().subscribe((responseData) => {
          this.userBoards.length = 0;
          let responseBoards = JSON.parse(responseData.body);
          for (let i = 0; i < responseBoards.length; i++) {
            let newBoard: newBoard = {boardName: responseBoards[i].boardName, boardId: responseBoards[i].id};
            this.userBoards.push(newBoard);
          }
        },
        error => console.log(error));
    }
  }

  addBoard(){
    this.boardService.addBoard(this.createBoardForm.value.board).subscribe((responseData: any) => {
        let newBoard: newBoard = {boardName: responseData.body.board.boardName, boardId: responseData.body.board.id};
        this.userBoards.push(newBoard);
      },
      error => console.log(error));
    this.createBoardForm.reset();
  };

  deleteBoard(event: any, boardId: number) {
    event.stopPropagation();
    if(confirm("Are you sure to delete board?")) {
      this.boardService.deleteBoard(boardId).subscribe((responseData) => {
          let filterUserBoards = this.userBoards.filter((item:newBoard) => item.boardId !== +responseData.body);
          this.userBoards = filterUserBoards;
        },
        error => console.log(error));
    }
  }
}
