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
    this.sublink = link.substr(link.lastIndexOf('/') + 1);
  }

  invite() {
    if(this.token) {
      this.boardService.invite(this.sublink, this.userId).subscribe((responseData: any) => {
        console.log(responseData.body);
        if (responseData.status == 200) {
          this.toggleForAuthorized = true;
        }

      }, error => {
        if (error.status == 409) {
          this.toggleForError = true;
        }
        });
    }
    if(!(localStorage.getItem('token'))) {
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



