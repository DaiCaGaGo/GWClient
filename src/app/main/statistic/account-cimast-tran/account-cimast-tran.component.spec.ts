import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCimastTranComponent } from './account-cimast-tran.component';

describe('AccountCimastTranComponent', () => {
  let component: AccountCimastTranComponent;
  let fixture: ComponentFixture<AccountCimastTranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCimastTranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCimastTranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
