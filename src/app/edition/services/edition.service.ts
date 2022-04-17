import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';


@Injectable({
  providedIn: 'root'
})
export class EditionService {

  constructor(private apiService: ApiService) {}

  list(request: RequestModel) {
    return this.apiService.getRequest<ResponseModel>(request.model).pipe(take(1));
  }

  add(request: RequestModel) {
    return this.apiService.postRequest<RequestModel>(request.model, request.data).pipe(take(1));
  }

  update(request: RequestModel) {
    return this.apiService.putRequest<RequestModel>(request.model, request.data).pipe(take(1));
  }

  remove(request: RequestModel) {
    return this.apiService.deleteRequest<RequestModel>(`${request.model}/${request.data}`).pipe(take(1));
  }

}
