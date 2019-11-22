import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBirthdayIndayComponent } from './sms-birthday-inday.component';

describe('SmsBirthdayIndayComponent', () => {
  let component: SmsBirthdayIndayComponent;
  let fixture: ComponentFixture<SmsBirthdayIndayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBirthdayIndayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBirthdayIndayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
