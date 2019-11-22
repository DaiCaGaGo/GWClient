import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVendorComponent } from './account-vendor.component';

describe('AccountVendorComponent', () => {
  let component: AccountVendorComponent;
  let fixture: ComponentFixture<AccountVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
