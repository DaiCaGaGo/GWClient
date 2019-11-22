import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsErrorComponent } from './sms-error.component';

describe('SmsErrorComponent', () => {
  let component: SmsErrorComponent;
  let fixture: ComponentFixture<SmsErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
