import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { RequestModel } from 'src/app/model/utils/RequestModel';

@Injectable({
  providedIn: 'root'
})
export class GlAccountService {

  private readonly BASE_URL = 'edition';

  constructor(private apiService: ApiService) {}

  find(request: RequestModel) {
    // return this.apiService.getRequest<ResponseModel>(`${this.BASE_URL}/model/${request.model}`).pipe(take(1));
    // TODO mock
    return [
      {
        glAccountCode: '2.3.9.42.83.9.423-1',
        glAccountName: 'description for genldgAccountPlan'
      }, {
        glAccountCode: '2.4.9.42.83.9.423-2',
        glAccountName: 'description for genldgAccountPlan'
      }, {
        glAccountCode: '2.3.9.42.83.9.423-9',
        glAccountName: 'description for genldgAccountPlan'
      }, {
        glAccountCode: '2.3.9.42.83.9.423-5',
        glAccountName: 'description for genldgAccountPlan'
      }, {
        glAccountCode: '2.3.9.42.83.9.423-4',
        glAccountName: 'description for genldgAccountPlan 2.3.9.42.83.9.423-4'
      }
    ]
  }
}
