import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, of, SchedulerLike, Subject, subscribeOn, Subscription } from 'rxjs';
import { Item } from 'src/app/model/Item';
import { Model } from 'src/app/model/Model';
import { ModelUtils } from 'src/app/model/utils/ModelUtils';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { EditionService } from '../services/edition.service';

@Component({
  selector: 'app-edition-panel',
  templateUrl: './edition-panel.component.html',
  styleUrls: ['./edition-panel.component.scss'],
  preserveWhitespaces: true
})
export class EditionPanelComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;

  routeSubscription!: Subscription;
  editionMode: ('list' | 'create' | 'edit') = 'list';

  model!: Model;
  modelEdit: any;

  items$: Observable<Model[]> = new Observable<Model[]>();
  error$ = new Subject<boolean>();

  constructor(
    private editionService: EditionService,
    private progressService: ProgressService,
    private alertService: AlertService,
    private route: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: any) => {
      ModelUtils.getModelInstance(this, params['editionModel']);
      if (!this.model) {
        this.alertService.modalError("There is no valid entity selected.");
      } else {
        this.onRefresh();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onRefresh() {
    this.progressService.showLoading();
    const requestModel: RequestModel = {
      model: this.model.constructor.name || '',
      data: this.model,
      searchOptions: {
        page: 1,
        limit: 10,
        order: 'desc',
        orderBy: 'systemType'
      }
    };
    this.items$ = this.editionService.find(requestModel)
      .pipe(
        map((response: ResponseModel) => response.data),
        catchError(error => {
          console.error('error', error)
          this.alertService.toastError("Error on getting data.")
          return of([])
        })
      );
    this.items$.subscribe({ complete: () => this.progressService.hideLoading() });
  }

  onCreate(): void {
    this.editionMode = 'create';
    this.modelEdit = ModelUtils.parseModel(this.model, {});
    this.drawer.open();
  }

  onEdit(model: Model): void {
    this.editionMode = 'edit';
    this.modelEdit = ModelUtils.parseModel(this.model, model);
    this.drawer.open();
  }

  onCancel(event: any) {
    this.onExitEditMode();
    this.drawer.close();
  }

  onExitEditMode() {
    this.editionMode = 'list';
    this.modelEdit = Object.assign({});
  }

  onSave(modelEdit: any) {
    if ('create' === this.editionMode) {
      this.progressService.showLoading();
      this.editionService.create(
        ModelUtils.parseToRequest(this.model.constructor.name, modelEdit)).subscribe(this.performAction('Create'));
    } else if ('edit' === this.editionMode) {
      this.progressService.showLoading();
      this.editionService.update(
        ModelUtils.parseToRequest(this.model.constructor.name, modelEdit)).subscribe(this.performAction('Update'));
    }
  }

  onDelete(model: Model): void {
    this.modelEdit = model;
    this.alertService.prompt().subscribe({
      next: () => this.delete()
    });
  }

  delete() {
    this.progressService.showLoading();
    this.editionService.delete(
      ModelUtils.parseToRequest(this.model.constructor.name, this.modelEdit[this.model.idField])).subscribe(this.performAction('Delete'));
  }

  beautifyName(name?: string) {
    return name?.replace(/([A-Z])/g, ' $1').trim().toUpperCase() ?? '';
  }

  getKeys(item: any, columnName: string) {
    return item[columnName];
  }

  performAction(actionName: string) {
    return {
      next: () => this.alertService.toastSuccess(`${actionName} with success!`),
      error: () => this.alertService.toastError(`Error on trying to ${actionName.toUpperCase()}.`),
      complete: () => {
        this.onRefresh();
        this.drawer.close();
      }
    }
  }

}
