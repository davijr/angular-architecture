import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ProgressService } from './shared/services/progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: true
})
export class AppComponent {
  title = 'my-app';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  reason = '';

  constructor(private progressService: ProgressService) {}

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  isLoading() {
    return this.progressService.getStatus();
  }
}
