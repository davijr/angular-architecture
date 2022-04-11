import { Injectable } from '@angular/core';
import { delay, take, tap } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Item } from 'src/app/model/item';


@Injectable({
  providedIn: 'root'
})
export class EditionService {

  constructor(private apiService: ApiService) {}

  list() {
    return this.apiService.getRequest<Item[]>('items')
      .pipe(
        delay(2000),
        take(1),
        tap((item: any) => console.log(item))
      );
  }

  add(item: Item): Item {
    return {id: 1, name: 'Item 1'};
  }

}
