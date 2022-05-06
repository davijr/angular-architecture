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
import { PromptModalComponent } from './prompt-modal/prompt-modal.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    AlertModalComponent,
    PromptModalComponent,
    DebugFormComponent,
    TableFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    TooltipModule,
    AlertModule.forRoot(),
    BsDatepickerModule
  ],
  exports: [
    AlertModalComponent,
    PromptModalComponent,
    TableFormComponent
  ],
  entryComponents: [
    AlertModalComponent,
    PromptModalComponent],
  providers: [OptionsService]
})
export class SharedModule { }
