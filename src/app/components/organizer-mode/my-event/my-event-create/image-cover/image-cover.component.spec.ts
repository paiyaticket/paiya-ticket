import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCoverComponent } from './image-cover.component';

describe('ImageCoverComponent', () => {
  let component: ImageCoverComponent;
  let fixture: ComponentFixture<ImageCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
