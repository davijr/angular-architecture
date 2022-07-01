import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, take, tap, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../model/User';
import { ResponseModel } from '../../model/utils/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_URL = 'auth';
  private readonly BZDF_TOKEN = 'bzdf_auth';
  private readonly LOGGED_USER = 'bzdf_username';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  public loggedUser: User | null = null;

  showMenuEmitter = new EventEmitter<boolean>();

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.validateToken();
  }

  validateToken() {
    const token = localStorage.getItem(this.BZDF_TOKEN)
    if (!token) {
      this._isLoggedIn$.next(false);
      this.router.navigate(['/login']);
      return false;
    }
    this._isLoggedIn$.next(true);
    return true;
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.BZDF_TOKEN)
  }

  removeJwtToken() {
    localStorage.removeItem(this.BZDF_TOKEN)
  }

  login (user: User) {
    return this.apiService.postRequest<ResponseModel>(`${this.BASE_URL}/authenticate`, user).pipe(
      take(1),
      tap(res => {
        // debugger
        this.loggedUser = res.data.user;
        this._isLoggedIn$.next(true);
        this.showMenuEmitter.emit(true);
        localStorage.setItem(this.BZDF_TOKEN, res.data.token)
        localStorage.setItem(this.LOGGED_USER, '' + this.loggedUser?.username)
        return this.loggedUser;
      }),
      catchError((error) => {
        this.showMenuEmitter.emit(false);
        return throwError(error);
      })
    );
  }

  logout () {
    localStorage.removeItem(this.BZDF_TOKEN);
    this._isLoggedIn$.next(false);
    this.loggedUser = null;
  }

  getLoggedUser() {
    return localStorage.getItem(this.LOGGED_USER);
  }
}
