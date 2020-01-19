import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColormapComponent } from './colormap.component';

describe('ColormapComponent', () => {
  let component: ColormapComponent;
  let fixture: ComponentFixture<ColormapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColormapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColormapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
