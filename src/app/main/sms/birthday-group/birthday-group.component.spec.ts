import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayGroupComponent } from './birthday-group.component';

describe('BirthdayGroupComponent', () => {
  let component: BirthdayGroupComponent;
  let fixture: ComponentFixture<BirthdayGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
