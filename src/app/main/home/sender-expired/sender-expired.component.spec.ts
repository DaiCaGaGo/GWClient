import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderExpiredComponent } from './sender-expired.component';

describe('SenderExpiredComponent', () => {
  let component: SenderExpiredComponent;
  let fixture: ComponentFixture<SenderExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
