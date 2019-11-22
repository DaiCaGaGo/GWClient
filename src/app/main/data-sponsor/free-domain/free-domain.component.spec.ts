import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeDomainComponent } from './free-domain.component';

describe('FreeDomainComponent', () => {
  let component: FreeDomainComponent;
  let fixture: ComponentFixture<FreeDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
