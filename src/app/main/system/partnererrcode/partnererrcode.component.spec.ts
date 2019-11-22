import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnererrcodeComponent } from './partnererrcode.component';

describe('PartnererrcodeComponent', () => {
  let component: PartnererrcodeComponent;
  let fixture: ComponentFixture<PartnererrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnererrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnererrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
