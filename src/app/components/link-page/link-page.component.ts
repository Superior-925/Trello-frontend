import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-link-page',
  templateUrl: './link-page.component.html',
  styleUrls: ['./link-page.component.scss']
})
export class LinkPageComponent implements OnInit {

  sublink: string = '';

  token: any = localStorage.getItem('token');

  userId: any = localStorage.getItem('userId');

  toggleForAuthorized: boolean = false;

  toggleForError: boolean = false;

  toggleForNotAuthorized: boolean = false;

  constructor(private router: Router, private boardService: BoardService) { }

  ngOnInit(): void {
    let link = window.location.pathname;
    console.log(link);
    this.sublink = link.substr(link.lastIndexOf('/') + 1);
    console.log(this.sublink);
  }

  invite() {
    if(this.token) {
      console.log(this.token);
      console.log("User ID " + this.userId);
      this.boardService.invite(this.sublink, this.userId).subscribe((responseData: any) => {
        console.log(responseData.status);
        if (responseData.status == 200) {
          this.toggleForAuthorized = true;
        }
        if (responseData.status == 409) {
          this.toggleForError = true;
        }
      });
    }
    if(!this.token) {
      this.toggleForNotAuthorized = true;
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToWorkspace() {
    this.router.navigate(['/workspace']);
  }
}



