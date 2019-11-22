import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysvarComponent } from './sysvar.component';

describe('SysvarComponent', () => {
  let component: SysvarComponent;
  let fixture: ComponentFixture<SysvarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysvarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysvarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
