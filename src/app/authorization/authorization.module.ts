import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthorizationRoutingModule } from './authorization.routing';
import { AccessControlFormComponent } from './components/access-control-form/access-control-form.component';
import { AccessControlComponent } from './pages/access-control/access-control.component';

@NgModule({
  declarations: [
    AccessControlComponent,
    AccessControlFormComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
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
export class AuthorizationModule { }
