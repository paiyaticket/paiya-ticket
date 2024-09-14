import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganisationCreateComponent } from './event-organisation-create.component';

describe('EventOrganisationCreateComponent', () => {
  let component: EventOrganisationCreateComponent;
  let fixture: ComponentFixture<EventOrganisationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOrganisationCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventOrganisationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
