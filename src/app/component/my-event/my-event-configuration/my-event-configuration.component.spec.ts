import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventConfigurationComponent } from './my-event-configuration.component';

describe('MyEventConfigurationComponent', () => {
  let component: MyEventConfigurationComponent;
  let fixture: ComponentFixture<MyEventConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEventConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
