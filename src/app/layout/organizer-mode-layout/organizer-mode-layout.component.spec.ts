import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerModeLayoutComponent } from './organizer-mode-layout.component';

describe('OrganizerModeLayoutComponent', () => {
  let component: OrganizerModeLayoutComponent;
  let fixture: ComponentFixture<OrganizerModeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerModeLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizerModeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
