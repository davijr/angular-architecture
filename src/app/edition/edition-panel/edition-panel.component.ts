import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, filter, first, map, Observable, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { Field, Model, Relationship } from 'src/app/model/Model';
import { SearchOptions } from 'src/app/model/SearchOptions';
import { ModelUtils } from 'src/app/model/utils/ModelUtils';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { AlertService } from 'src/app/shared/services/alert.service';
import { OptionsService } from 'src/app/shared/services/options.service';
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
  editionMode: ('list' | 'create' | 'edit' | 'copy') = 'list';

  model!: Model;
  modelEdit: any;

  items$: Observable<Model[]> = new Observable<Model[]>();
  itemsWithoutFilters$: Observable<Model[]> = new Observable<Model[]>();
  error$ = new Subject<boolean>();
  
  searchOptions: SearchOptions = {
    page: 1,
    limit: 10,
    order: 'desc',
    orderBy: 'systemType'
  }
  
  /**
   * Elements for Filter Component:
   */
  filterObject: any = {};
  formFilter!: FormGroup;
  relationships: Relationship[] = [];

  constructor(
    private editionService: EditionService,
    private optionsService: OptionsService,
    private progressService: ProgressService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: any) => {
      ModelUtils.getModelInstance(this, params['editionModel']);
      if (!this.model) {
        this.alertService.modalError("There is no valid entity selected.");
      } else {
        this.buildFilterFields();
        this.onRefresh();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onRefresh() {
    this.progressService.showLoading();
    this.clearFilter();
    const requestModel: RequestModel = {
      model: this.model.constructor.name || '',
      data: this.model,
      searchOptions: this.searchOptions
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
    this.itemsWithoutFilters$ = this.items$;
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

  onCopy(model: Model): void {
    this.editionMode = 'copy';
    const modelCopy: any = Object.assign({}, model);
    delete modelCopy[this.model.idField];
    this.modelEdit = ModelUtils.parseModel(this.model, modelCopy);
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

  /**
   * Component: Dynamic Filters
   */

  buildFilterFields() {
    const formGroup: any = {};
    this.model.fields.forEach((field: Field) => {
      const validators: any[] = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.length) {
        validators.push(Validators.maxLength(field.length));
      }
      formGroup[field.name] = [null, validators];
    });
    this.formFilter = this.formBuilder.group(formGroup);
    this.initFilters()
    this.getRelationships()
  }

  initFilters() {
    Object.keys(this.formFilter.controls).forEach((element: any) => {
      const formElement: any = this.formFilter.get(element) || {};
      formElement.valueChanges
        .pipe(
          map((value: string) => value?.trim()),
          // filter((value: string) => value.length > 1),
          debounceTime(200),
          distinctUntilChanged()
        ).subscribe((filter: any) => this.filterItems(element, filter));
    });
  }

  filterItems(filterElement: any, filterValue: any) {
    if (filterValue) {
      this.filterObject[filterElement] = filterValue;
    } else {
      delete  this.filterObject[filterElement];
    }
    this.items$ = this.itemsWithoutFilters$;
    this.items$ = this.items$.pipe(
      map((mapObject: any) => mapObject.filter((item: any) => {
        // percorrer todos os campos de filtro preenchidos e filtrar os itens utilizando regra AND
        let matches = 0;
        Object.keys(this.filterObject).forEach((filterItem: string) => {
          if (item[filterItem]?.toLowerCase().startsWith(this.filterObject[filterItem]?.toLowerCase())) {
            matches++;
          }
        })
        return matches === Object.keys(this.filterObject).length;
      }))
    );
  }

  clearFilter() {
    this.items$ = this.itemsWithoutFilters$;
    Object.keys(this.formFilter!.controls).forEach((element: any) => {
      this.formFilter!.get(element)?.setValue(null);
    });
  }

  getRelationships() {
    this.model.fields.forEach((field: Field) => {
      if (field.type.includes('relationship')) {
        const relationship = Object.assign({}, field.relationship);
        const request = <RequestModel> {
          model: relationship.name
        };
        this.progressService.showLoading();
        this.optionsService.list(request).pipe(
          catchError(error => {
            console.error('error', error)
            // this.alertService.modalSuccess({} as BsModalRef, error.message);
            this.alertService.toastError(error.message);
            this.progressService.hideLoading();
            return of()
          })
        ).subscribe((response: ResponseModel) => {
          relationship.data = response.data;
          this.relationships.push(relationship);
          this.progressService.hideLoading();
        });
      }
    });
  }
  
  getOptions(relationshipName: string) {
    const filtered: Relationship[] = this.relationships?.filter((i) => i.name === relationshipName) ?? [];
    return filtered[0]?.data ?? [];
  }

  getShowFields(relationshipName: string, data: any): string {
    const filtered: Relationship[] = this.relationships?.filter((i) => i.name === relationshipName) ?? [];
    const showFields = filtered[0]?.showFields ?? [];
    let show = '';
    showFields.forEach((field, index) => {
      if (index > 0) {
        show += ` - ${data[field]}`;
      } else {
        show += `${data[field]}`;
      }
    });
    return show;
  }

}
