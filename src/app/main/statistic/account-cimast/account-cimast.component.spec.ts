import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCimastComponent } from './account-cimast.component';

describe('AccountCimastComponent', () => {
  let component: AccountCimastComponent;
  let fixture: ComponentFixture<AccountCimastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCimastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCimastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
