import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPopularEventComponent } from './most-popular-event.component';

describe('MostPopularEventComponent', () => {
  let component: MostPopularEventComponent;
  let fixture: ComponentFixture<MostPopularEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPopularEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostPopularEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
