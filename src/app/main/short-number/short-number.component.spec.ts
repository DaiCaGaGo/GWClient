import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortNumberComponent } from './short-number.component';

describe('ShortNumberComponent', () => {
  let component: ShortNumberComponent;
  let fixture: ComponentFixture<ShortNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
