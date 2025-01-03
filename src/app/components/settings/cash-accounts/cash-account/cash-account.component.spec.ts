import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAccountComponent } from './cash-account.component';

describe('CashAccountComponent', () => {
  let component: CashAccountComponent;
  let fixture: ComponentFixture<CashAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
