import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './authentication/services/auth.service';
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
  menuOptions: any = [];
  showMenu = new Observable<boolean>();
  username: string | null = null;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    public authService: AuthService,
    private router: Router,
    public progressService: ProgressService,
    private editionService: EditionService) {
      this.showMenu = this.authService.isLoggedIn$;
      if (!this.isLoginScreen()) {
        this.getMenuOptions();
        this.username = this.authService.getLoggedUser();
      }
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

  isLoginScreen(): boolean {
    return window.location.pathname === '/login';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
