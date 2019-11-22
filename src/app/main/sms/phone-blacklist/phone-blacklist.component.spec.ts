import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBlacklistComponent } from './phone-blacklist.component';

describe('PhoneBlacklistComponent', () => {
  let component: PhoneBlacklistComponent;
  let fixture: ComponentFixture<PhoneBlacklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneBlacklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
