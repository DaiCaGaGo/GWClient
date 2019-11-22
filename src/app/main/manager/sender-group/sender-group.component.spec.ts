import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderGroupComponent } from './sender-group.component';

describe('SenderGroupComponent', () => {
  let component: SenderGroupComponent;
  let fixture: ComponentFixture<SenderGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
