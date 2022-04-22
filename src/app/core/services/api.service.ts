import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_URL: string = environment.API_URL || 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getRequest<T>(url: string) {
    return this.http.get<T>(`${this.API_URL}${url}`);
  }

  postRequest<T>(url: string, data: any) {
    return this.http.post<T>(`${this.API_URL}${url}`, data);
  }

  putRequest<T>(url: string, data: any) {
    return this.http.put<T>(`${this.API_URL}${url}`, data);
  }

  deleteRequest<T>(url: string) {
    return this.http.delete<T>(`${this.API_URL}${url}`);
  }

}
