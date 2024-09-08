import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAccountUpdateComponent } from './cash-account-update.component';

describe('CashAccountUpdateComponent', () => {
  let component: CashAccountUpdateComponent;
  let fixture: ComponentFixture<CashAccountUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashAccountUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashAccountUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
