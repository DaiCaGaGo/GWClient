import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsListAgencyComponent } from './sms-list-agency.component';

describe('SmsListAgencyComponent', () => {
  let component: SmsListAgencyComponent;
  let fixture: ComponentFixture<SmsListAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsListAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsListAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
