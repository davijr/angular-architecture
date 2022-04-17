import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../shared/shared.module';
import { EditionPanelComponent } from './edition-panel/edition-panel.component';
import { EditionRoutingModule } from './edition.routing';

@NgModule({
  declarations: [
    EditionPanelComponent
  ],
  imports: [
    CommonModule,
    EditionRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class EditionModule { }
