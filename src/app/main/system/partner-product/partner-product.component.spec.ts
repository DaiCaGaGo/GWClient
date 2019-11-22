import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerProductComponent } from './partner-product.component';

describe('PartnerProductComponent', () => {
  let component: PartnerProductComponent;
  let fixture: ComponentFixture<PartnerProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
