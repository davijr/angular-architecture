import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationDimensionGroupComponent } from './reconciliation-dimension-group.component';

describe('ReconciliationDimensionGroupComponent', () => {
  let component: ReconciliationDimensionGroupComponent;
  let fixture: ComponentFixture<ReconciliationDimensionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationDimensionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationDimensionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
