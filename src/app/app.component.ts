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
  title = 'HSBC - BZDF Frontend';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  reason = '';

  constructor(public progressService: ProgressService) {}

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  isLoading() {
    return this.progressService.isLoading();
  }

  getMenuOptions() {
    return [
      {
        name: 'SYS',
        active: true,
        items: [
          { name: 'External System', route: 'edition', param: 'SysExternalSystem', active: true },
          { name: 'External Currency', route: 'edition', param: 'SysCurrency', active: true },
          { name: 'External Curve', route: 'edition', param: 'SysCurve', active: true },
          { name: 'External Curve Underlying Link', route: 'edition', param: 'SysCurveUnderlyingLink', active: true },
          { name: 'External Underlying', route: 'edition', param: 'SysUnderlying', active: true },
          { name: 'External Underlying Type', route: 'edition', param: 'SysUnderlyingType', active: true },
          { name: '', route: '', param: '', active: false },
        ]
      },
      {
        name: 'COMPANY',
        active: false,
        items: [
          { name: '', route: '', param: '', active: false },
          { name: '', route: '', param: '', active: false },
        ]
      },
      {
        name: 'INVPTY',
        active: false,
        items: [
          { name: '', route: '', param: '', active: false },
          { name: '', route: '', param: '', active: false },
        ]
      },
      {
        name: 'MKTD',
        active: false,
        items: [
          { name: '', route: '', param: '', active: false },
          { name: '', route: '', param: '', active: false },
        ]
      },
      {
        name: 'PRODUCT',
        active: false,
        items: [
          { name: '', route: '', param: '', active: false },
          { name: '', route: '', param: '', active: false },
        ]
      },
      {
        name: 'DOMS',
        active: false,
        items: [
          { name: 'Doms System Type', route: 'edition', param: 'DomsSystemType', active: true },
          { name: '', route: '', param: '', active: false },
        ]
      },
    ]
  }
}
