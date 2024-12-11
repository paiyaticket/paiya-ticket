import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaUpdateComponent } from './agenda-update.component';

describe('AgendaCreateComponent', () => {
  let component: AgendaUpdateComponent;
  let fixture: ComponentFixture<AgendaUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
