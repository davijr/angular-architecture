import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationMetricFormComponent } from './reconciliation-metric-form.component';

describe('ReconciliationMetricFormComponent', () => {
  let component: ReconciliationMetricFormComponent;
  let fixture: ComponentFixture<ReconciliationMetricFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationMetricFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationMetricFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
