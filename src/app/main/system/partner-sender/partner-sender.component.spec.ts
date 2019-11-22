import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSenderComponent } from './partner-sender.component';

describe('PartnerSenderComponent', () => {
  let component: PartnerSenderComponent;
  let fixture: ComponentFixture<PartnerSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
