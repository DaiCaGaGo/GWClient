import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsCustomizeComponent } from './sms-customize.component';

describe('SmsCustomizeComponent', () => {
  let component: SmsCustomizeComponent;
  let fixture: ComponentFixture<SmsCustomizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsCustomizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
