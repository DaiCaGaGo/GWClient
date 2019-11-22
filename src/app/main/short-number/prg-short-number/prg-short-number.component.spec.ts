import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrgShortNumberComponent } from './prg-short-number.component';

describe('PrgShortNumberComponent', () => {
  let component: PrgShortNumberComponent;
  let fixture: ComponentFixture<PrgShortNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrgShortNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrgShortNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
