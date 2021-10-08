// import {AuthService} from "./auth.service";
// import {HttpClient} from '@angular/common/http';
// import {HttpHandler} from "@angular/common/http";
// import {UrlSerializer} from "@angular/router";
// import {EMPTY, of} from "rxjs";
// import {Router} from "@angular/router";
// import {Type} from "@angular/core";
// import {ChildrenOutletContexts} from "@angular/router";
// import {Location} from "@angular/common";
// import {Injector} from "@angular/core";
// import {NgModuleFactoryLoader} from "@angular/core";
// import {Compiler} from "@angular/core";
// import {Routes} from "@angular/router";
//
// describe('Auth Service', () => {
//
//   let handler: HttpHandler;
//   let urlSerializer: UrlSerializer;
//   let rootComponentType: Type<any> | null;
//   let rootContexts: ChildrenOutletContexts;
//   let location: Location;
//   let injector: Injector;
//   let loader: NgModuleFactoryLoader;
//   let compiler: Compiler;
//   let config: Routes;
//
//   let service: AuthService;
//
//   beforeEach(() => {
//     const http = new HttpClient(handler);
//     const router = new Router(rootComponentType, urlSerializer, rootContexts, location,
//       injector, loader, compiler, config);
//     service = new AuthService(http, router);
//   });
//
//   it('should call signUp method', () => {
//     const spy = spyOn(service, 'signUp').and.callFake(() => {
//       return EMPTY
//     });
//
//     service.signUp("asd@mail.ru", "111111");
//
//     expect(spy).toHaveBeenCalled()
//   });
//
//   it('should call logOut method', () => {
//     const spy = spyOn(service, 'logOut').and.callFake(() => {
//       return EMPTY
//     });
//
//     service.logOut();
//
//     expect(spy).toHaveBeenCalled()
//   });
//
// });
