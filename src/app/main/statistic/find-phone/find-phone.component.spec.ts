import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPhoneComponent } from './find-phone.component';

describe('FindPhoneComponent', () => {
  let component: FindPhoneComponent;
  let fixture: ComponentFixture<FindPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
