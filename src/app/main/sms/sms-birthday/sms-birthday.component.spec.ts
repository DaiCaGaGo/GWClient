import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBirthdayComponent } from './sms-birthday.component';

describe('SmsBirthdayComponent', () => {
  let component: SmsBirthdayComponent;
  let fixture: ComponentFixture<SmsBirthdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBirthdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
