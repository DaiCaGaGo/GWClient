import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCimastComponent } from './data-cimast.component';

describe('DataCimastComponent', () => {
  let component: DataCimastComponent;
  let fixture: ComponentFixture<DataCimastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCimastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCimastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
