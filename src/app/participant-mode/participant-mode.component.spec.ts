import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantModeComponent } from './participant-mode.component';

describe('ParticipantModeComponent', () => {
  let component: ParticipantModeComponent;
  let fixture: ComponentFixture<ParticipantModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
