import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganisationListComponent } from './event-organisation-list.component';

describe('EventOrganisationListComponent', () => {
  let component: EventOrganisationListComponent;
  let fixture: ComponentFixture<EventOrganisationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOrganisationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventOrganisationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
