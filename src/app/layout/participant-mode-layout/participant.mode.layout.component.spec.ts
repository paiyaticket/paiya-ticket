import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantModeLayoutComponent } from './participant.mode.layout.component';


describe('ParticipantModeLayoutComponent', () => {
  let component: ParticipantModeLayoutComponent;
  let fixture: ComponentFixture<ParticipantModeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantModeLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantModeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
