import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, Observable, of, Subject } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { Item } from 'src/app/model/item';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { EditionService } from '../services/edition.service';

@Component({
  selector: 'app-edition-panel',
  templateUrl: './edition-panel.component.html',
  styleUrls: ['./edition-panel.component.scss']
})
export class EditionPanelComponent implements OnInit {

  bsModalRef: BsModalRef = new BsModalRef();
  items$: Observable<Item[]> = new Observable();
  error$ = new Subject<boolean>();

  constructor(private editionService: EditionService,
    private alertService: AlertService) { }
  
  ngOnInit(): void {
    this.onRefresh()
  }

  onRefresh() {
    this.items$ = this.editionService.list()
      .pipe(
        catchError(error => {
          console.error('oxente', error)
          this.handleError()
          return of()
        })
    )
  }

  onEdit(id: number): void {}

  onDelete(item: Item): void {}

  onConfirmDelete() {}

  onDeclineDelete() {}

  handleError() {
    this.alertService.success(this.bsModalRef, "OMG! Ocorreu um erro.")
  }

}
