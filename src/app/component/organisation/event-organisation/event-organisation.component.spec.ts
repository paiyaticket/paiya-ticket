import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganisationComponent } from './event-organisation.component';

describe('EventOrganisationComponent', () => {
  let component: EventOrganisationComponent;
  let fixture: ComponentFixture<EventOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOrganisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
