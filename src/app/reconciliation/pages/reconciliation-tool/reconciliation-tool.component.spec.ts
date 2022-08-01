import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationToolComponent } from './reconciliation-tool.component';

describe('ReconciliationToolComponent', () => {
  let component: ReconciliationToolComponent;
  let fixture: ComponentFixture<ReconciliationToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
