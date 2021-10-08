import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardsComponent } from './boards.component';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientModule} from "@angular/common/http";
import { By } from '@angular/platform-browser';

describe('BoardsComponent', () => {
  let component: BoardsComponent;
  let fixture: ComponentFixture<BoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ BoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('there must be a "create board" button', (() => {
    const button = fixture.debugElement.nativeElement.querySelector('#open-modal-button');

    expect(button.innerHTML).toBe('Create board');
  }));

  it('should click on button "create board"', (() => {
    spyOn(component, 'addBoard');

    let button = fixture.debugElement.nativeElement.querySelector('#submit-button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.addBoard).toHaveBeenCalled();
    });
  }));

});
