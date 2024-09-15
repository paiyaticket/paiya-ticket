import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventItemComponent } from './my-event-item.component';

describe('MyEventItemComponent', () => {
  let component: MyEventItemComponent;
  let fixture: ComponentFixture<MyEventItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEventItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
