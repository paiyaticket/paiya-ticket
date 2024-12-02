import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventSidebarMenuComponent } from './my-event-sidebar-menu.component';

describe('MyEventSidebarMenuComponent', () => {
  let component: MyEventSidebarMenuComponent;
  let fixture: ComponentFixture<MyEventSidebarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventSidebarMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEventSidebarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
