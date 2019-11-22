import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCampaignComponent } from './data-campaign.component';

describe('DataCampaignComponent', () => {
  let component: DataCampaignComponent;
  let fixture: ComponentFixture<DataCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
