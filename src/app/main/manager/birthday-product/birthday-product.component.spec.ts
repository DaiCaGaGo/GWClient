import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayProductComponent } from './birthday-product.component';

describe('BirthdayProductComponent', () => {
  let component: BirthdayProductComponent;
  let fixture: ComponentFixture<BirthdayProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdayProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
