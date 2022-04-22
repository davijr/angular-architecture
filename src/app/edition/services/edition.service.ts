import { Injectable } from '@angular/core';
import { map, take } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';


@Injectable({
  providedIn: 'root'
})
export class EditionService {

  private readonly BASE_URL = 'edition';

  constructor(private apiService: ApiService) {}

  find(request: RequestModel) {
    return this.apiService.getRequest<ResponseModel>(`${this.BASE_URL}/${request.model}`).pipe(take(1));
  }

  create(request: RequestModel) {
    return this.apiService.postRequest<ResponseModel>(`${this.BASE_URL}/${request.model}`, request.data).pipe(take(1));
  }

  update(request: RequestModel) {
    return this.apiService.putRequest<ResponseModel>(`${this.BASE_URL}/${request.model}`, request.data).pipe(take(1));
  }

  delete(request: RequestModel) {
    return this.apiService.deleteRequest<ResponseModel>(`${this.BASE_URL}/${request.model}/${request.data}`).pipe(take(1));
  }

}
