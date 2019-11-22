import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFeeComponent } from './account-fee.component';

describe('AccountFeeComponent', () => {
  let component: AccountFeeComponent;
  let fixture: ComponentFixture<AccountFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
