import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSponsorComponent } from './data-sponsor.component';

describe('DataSponsorComponent', () => {
  let component: DataSponsorComponent;
  let fixture: ComponentFixture<DataSponsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSponsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
