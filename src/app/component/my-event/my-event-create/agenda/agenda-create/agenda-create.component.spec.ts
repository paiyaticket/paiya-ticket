import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCreateComponent } from './agenda-create.component';

describe('AgendaCreateComponent', () => {
  let component: AgendaCreateComponent;
  let fixture: ComponentFixture<AgendaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
