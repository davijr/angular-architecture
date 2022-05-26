import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { EditionService } from './edition/services/edition.service';
import { ProgressService } from './shared/services/progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: true
})
export class AppComponent {
  title = 'HSBC - BZDF Frontend';
  reason = '';
  menuOptions: any = []

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    public progressService: ProgressService,
    private editionService: EditionService) {
      this.getMenuOptions();
  }

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  isLoading() {
    return this.progressService.isLoading();
  }

  getMenuOptions() {
    this.editionService.getMenuOptions().subscribe((items: any) => this.menuOptions = items);
  }

  onOpenEvent(item: any) {
    item.expanded = !item.expanded
  }
}
