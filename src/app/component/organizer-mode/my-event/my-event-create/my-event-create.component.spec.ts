import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventCreateComponent } from './my-event-create.component';

describe('MyEventCreateComponent', () => {
  let component: MyEventCreateComponent;
  let fixture: ComponentFixture<MyEventCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEventCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
