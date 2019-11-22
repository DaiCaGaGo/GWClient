import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBrandnameComponent } from './sms-brandname.component';

describe('SmsBrandnameComponent', () => {
  let component: SmsBrandnameComponent;
  let fixture: ComponentFixture<SmsBrandnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBrandnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBrandnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
