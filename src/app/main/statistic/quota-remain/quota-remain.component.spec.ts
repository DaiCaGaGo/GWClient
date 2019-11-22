import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaRemainComponent } from './quota-remain.component';

describe('QuotaRemainComponent', () => {
  let component: QuotaRemainComponent;
  let fixture: ComponentFixture<QuotaRemainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotaRemainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaRemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
