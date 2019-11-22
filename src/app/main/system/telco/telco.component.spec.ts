import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelcoComponent } from './telco.component';

describe('TelcoComponent', () => {
  let component: TelcoComponent;
  let fixture: ComponentFixture<TelcoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
