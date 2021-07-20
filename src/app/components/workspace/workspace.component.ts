import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {BoardService} from "../../services/board.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  providers: [BoardService]
})

export class WorkspaceComponent implements OnInit {

  createBoardForm : FormGroup;

  itemsLinks =[{name: 'Number one', id: 3}, {name: 'Top board', id: 5}, {name: 'Other board', id: 8}];

  boardName: string = '';

  boardId: number = 0;

  constructor(private boardService: BoardService, private authService: AuthService) {
    this.createBoardForm = new FormGroup({
      board: new FormControl('', [
        Validators.required
      ])
    });
  }

  submit(){
    this.boardService.addBoard(this.createBoardForm.value.board, localStorage.getItem('userId'), localStorage.getItem('token'))
  }

  selectBoard(id: number, board: string) {
    let boardId = id;
    let tableName = board;
    this.boardName = board;
    console.log("Board id = " + boardId, "Board name = " + tableName);
  }

  ngOnInit(): void {
  }

}
