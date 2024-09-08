import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAccountCreateComponent } from './cash-account-create.component';

describe('CashAccountCreateComponent', () => {
  let component: CashAccountCreateComponent;
  let fixture: ComponentFixture<CashAccountCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashAccountCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashAccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
