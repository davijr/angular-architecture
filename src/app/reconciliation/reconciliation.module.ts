import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';
import { ReconciliationToolComponent } from './pages/reconciliation-tool/reconciliation-tool.component';
import { ReconciliationDimensionGroupComponent } from './pages/reconciliation-dimension-group/reconciliation-dimension-group.component';
import { ReconciliationRoutingModule } from './reconciliation.routing';
import { MatChipsModule } from '@angular/material/chips';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReconciliationFormComponent } from './components/reconciliation-form/reconciliation-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { ReconciliationMetricFormComponent } from './components/reconciliation-metric-form/reconciliation-metric-form.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  declarations: [
    ReconciliationToolComponent,
    ReconciliationDimensionGroupComponent,
    ReconciliationFormComponent,
    ReconciliationMetricFormComponent
  ],
  imports: [
    CommonModule,
    ReconciliationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatStepperModule
  ]
})
export class ReconciliationModule { }
