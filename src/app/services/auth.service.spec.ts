import {AuthService} from "./auth.service";
import {HttpClient} from '@angular/common/http';
import {HttpHandler} from "@angular/common/http";
import {EMPTY, of} from "rxjs";

describe('Auth Service', () => {
  let handler: HttpHandler;
  let service: AuthService;

  beforeEach(() => {
    const http = new HttpClient(handler);
    service = new AuthService(http)
  });

  it('should call signUp method', () => {
    const spy = spyOn(service, 'signUp').and.callFake(() => {
      return EMPTY
    });

    service.signUp("asd@mail.ru", "111111");

    expect(spy).toHaveBeenCalled()
  });

  it('should call logOut method', () => {
    const spy = spyOn(service, 'logOut').and.callFake(() => {
      return EMPTY
    });

    service.logOut();

    expect(spy).toHaveBeenCalled()
  });

});
