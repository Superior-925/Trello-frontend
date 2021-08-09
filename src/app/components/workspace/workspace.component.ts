import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {BoardService} from "../../services/board.service";
import {AuthService} from "../../services/auth.service";
import {AfterViewInit} from "@angular/core";
import {OnChanges} from "@angular/core";
import {Board} from "../../interfaces/board";
import {AfterViewChecked} from "@angular/core";
import {DoCheck} from "@angular/core";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})

export class WorkspaceComponent implements OnChanges, AfterViewInit, OnInit, AfterViewChecked, DoCheck{

  createBoardForm : FormGroup;

  userBoards: any = [];

  boardName: string = '';

  boardId: number;

  newBoardName: string = '';

  boardLink: string = '';

  boardOwner: boolean;

  constructor(private boardService: BoardService, private authService: AuthService) {

     // this.loadBoardRigths();

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
        this.loadBoardRigth();
      },
      error => console.log(error));
    //
  }

  ngOnChanges(): void {
    this.userBoards =[];
    this.loadBoardRigth();
    // this.loadBoardRigths();
  }

  ngOnInit(): void {
     //this.loadBoardRigths();
  }

  ngAfterViewChecked(): void {
    //this.loadBoardRigths();
  }

  ngDoCheck(): void {
    //this.loadBoardRigths();
  }

  addBoard(){
    this.boardService.addBoard(this.createBoardForm.value.board).subscribe((responseData: any) => {
        let newBoard = new Board(responseData.body.boardName, responseData.body.id);
        this.userBoards.push(newBoard);
        this.selectNewBoard(responseData.body.id, responseData.body.boardName)
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
        console.log(this.userBoards);

        if (this.userBoards.length) {
          this.selectNewBoard(this.userBoards[0].boardId, this.userBoards[0].boardName)}
        else {this.boardName = 'No boards'}

      });
    }
  }

  selectBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
    this.loadBoardRigth();
    // console.log("Board owner: " + this.boardOwner);
  }

  selectNewBoard(id: number, board: string) {
    this.boardName = board;
    this.boardId = id;
    this.loadBoardRigth();
    // console.log("Board owner: " + this.boardOwner);
  }

  inviteCreateLink($event: any) {
    $event.preventDefault();
    this.boardService.inviteCreateLink(this.boardId).subscribe((responseData: any) => {
      this.boardLink = responseData.body;
    });
  };

  loadBoardRigth() {
    this.boardService.loadBoardRigth(this.boardId).subscribe((responseData: any) => {
      let responseParse = JSON.parse(responseData.body);
      this.boardOwner = responseParse.owner;
      console.log("Board owner: " + this.boardOwner);
    });
  }

}
