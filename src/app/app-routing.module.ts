import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./components/home-page/home-page.component";
import {SignupPageComponent} from "./components/signup-page/signup-page.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {LinkPageComponent} from "./components/link-page/link-page.component";
import {BoardsComponent} from "./components/boards/boards.component";

const appRoutes: Routes =[
  { path: 'home', component: HomePageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'boards', component: BoardsComponent },
  { path: 'workspace/:id', component: WorkspaceComponent },
  { path: 'link/:token', component: LinkPageComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
