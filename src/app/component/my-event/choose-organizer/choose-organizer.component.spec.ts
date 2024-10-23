import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOrganizerComponent } from './choose-organizer.component';

describe('ChooseOrganizerComponent', () => {
  let component: ChooseOrganizerComponent;
  let fixture: ComponentFixture<ChooseOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseOrganizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
