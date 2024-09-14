import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventListComponent } from './my-event-list.component';

describe('MyEventListComponent', () => {
  let component: MyEventListComponent;
  let fixture: ComponentFixture<MyEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
