import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditionPanelComponent } from './edition-panel/edition-panel.component';
import { EditionRoutingModule } from './edition.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    EditionPanelComponent
  ],
  imports: [
    CommonModule,
    EditionRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule
  ]
})
export class EditionModule { }
