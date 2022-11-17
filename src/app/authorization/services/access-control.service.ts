import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  private readonly BASE_URL = 'uac';

  constructor(private apiService: ApiService) {}

  findAccounts() {
    return this.apiService.getRequest<ResponseModel>(`${this.BASE_URL}`).pipe(take(1));
  }

  findMetrics() {
    return this.apiService.getRequest<ResponseModel>(`${this.BASE_URL}`).pipe(take(1));
  }

  create(request: RequestModel) {
    return this.apiService.postRequest<ResponseModel>(`${this.BASE_URL}`, request.data).pipe(take(1));
  }

  update(request: RequestModel) {
    return this.apiService.putRequest<ResponseModel>(`${this.BASE_URL}`, request.data).pipe(take(1));
  }

  delete(request: RequestModel) {
    return this.apiService.deleteRequest<ResponseModel>(`${this.BASE_URL}/${request.data}`).pipe(take(1));
  }
}
