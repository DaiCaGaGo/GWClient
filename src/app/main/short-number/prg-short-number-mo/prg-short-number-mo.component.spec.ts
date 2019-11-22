import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrgShortNumberMoComponent } from './prg-short-number-mo.component';

describe('PrgShortNumberMoComponent', () => {
  let component: PrgShortNumberMoComponent;
  let fixture: ComponentFixture<PrgShortNumberMoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrgShortNumberMoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrgShortNumberMoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
