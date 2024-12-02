import { TestBed } from '@angular/core/testing';

import { EventOrganizerService } from './event-organizer.service';

describe('EventOrganizerService', () => {
  let service: EventOrganizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventOrganizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
