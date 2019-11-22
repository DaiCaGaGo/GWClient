import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountQuotaComponent } from './account-quota.component';

describe('AccountQuotaComponent', () => {
  let component: AccountQuotaComponent;
  let fixture: ComponentFixture<AccountQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
