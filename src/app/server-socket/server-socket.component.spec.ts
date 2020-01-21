import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSocketComponent } from './server-socket.component';

describe('ServerSocketComponent', () => {
  let component: ServerSocketComponent;
  let fixture: ComponentFixture<ServerSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
