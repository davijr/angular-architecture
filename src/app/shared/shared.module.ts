import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { DebugFormComponent } from './debug-form/debug-form.component';
import { TableFormComponent } from './table-form/table-form.component';

import { OptionsService } from './services/options.service'

@NgModule({
  declarations: [
    AlertModalComponent,
    DebugFormComponent,
    TableFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    TooltipModule,
    AlertModule.forRoot()
  ],
  exports: [
    AlertModalComponent,
    TableFormComponent
  ],
  entryComponents: [AlertModalComponent],
  providers: [OptionsService]
})
export class SharedModule { }
