import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSenderComponent } from './account-sender.component';

describe('AccountSenderComponent', () => {
  let component: AccountSenderComponent;
  let fixture: ComponentFixture<AccountSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
