import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerModeComponent } from './organizer-mode.component';

describe('OrganizerModeComponent', () => {
  let component: OrganizerModeComponent;
  let fixture: ComponentFixture<OrganizerModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizerModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
