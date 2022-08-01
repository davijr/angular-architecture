import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged, filter, map, Observable, startWith, switchMap, take, tap } from 'rxjs';
import { EditionService } from 'src/app/edition/services/edition.service';
import { Model, Relationship } from 'src/app/model/Model';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { BaseFormComponent } from 'src/app/shared/components/base-form/base-form.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { OptionsService } from 'src/app/shared/services/options.service';
import { ProgressService } from 'src/app/shared/services/progress.service';

@Component({
  selector: 'app-reconciliation-metric-form',
  templateUrl: './reconciliation-metric-form.component.html',
  styleUrls: ['./reconciliation-metric-form.component.scss'],
  preserveWhitespaces: true
})
export class ReconciliationMetricFormComponent extends BaseFormComponent implements OnInit {
  
  @Input() editionMode: ('list' | 'create' | 'edit' | 'copy') = 'edit';
  @Input() modelEdit!: Model;
  @Output() cancel = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  // loadingStatus
  loadingStatus: any = [];
  
  // product
  product: any;
  allProducts$!: Observable<any>| undefined;

  // glClass
  glClass: any;
  allGlClasses$!: Observable<any>| undefined;

  // map + operators
  reconBzdfPoints: any[] = [];

  constructor(
    optionsService: OptionsService,
    alertService: AlertService,
    progressService: ProgressService,
    private modalService: BsModalService,
    private editionService: EditionService) {
      super(optionsService, alertService, progressService);
  }

  override ngOnInit(): void {
    this.model = this.parse(this.modelEdit);
    this.reconBzdfPoints = (this.model as any)?.reconBzdfPoints || [];
    this.initForm();
    this.form.addControl('reconBzdfMapId', new FormControl('', Validators.required));
    this.form.addControl('mathOperatorId', new FormControl('', Validators.required));
    if (this.editionMode === 'edit') {
      this.form.get(this.modelEdit.idField)?.disable();
    }
    this.allProducts$ = this.form.get('productCode')?.valueChanges.pipe(
      tap(() => {
        this.loadingStatus['productCode'] = true;
      }),
      distinctUntilChanged(),
      debounceTime(400),
      filter((value) => !!value),
      switchMap(value => this.filterProduct(value))
    );
    this.allGlClasses$ = this.form.get('glClass')?.valueChanges.pipe(
      tap(() => {
        this.loadingStatus['glClass'] = true;
      }),
      distinctUntilChanged(),
      debounceTime(400),
      filter((value) => !!value),
      switchMap(value => this.filterGlClass(value))
    );
  }
  
  submit(model: Model): void {
    this.save.emit(model);
  }

  onSave() {
    if (!this.isDisableSubmitButton()) {
      const reconDimension: any = this.form.value;
      reconDimension.index = (this.model as any).index;
      reconDimension.reconBzdfPoints = this.reconBzdfPoints;
      // product
      reconDimension.product = reconDimension.productCode;
      reconDimension.productCode = reconDimension.product?.productCode;
      // class
      reconDimension.domsGlClass = reconDimension.glClass;
      reconDimension.glClass = reconDimension.domsGlClass?.domain;
      // metric
      const metrics = this.getOptions('ReconMetric').filter(i => i.reconMetricId === Number(reconDimension.reconMetricId));
      reconDimension.reconMetric = metrics.length > 0 ? metrics[0] : null;
      this.save.emit(reconDimension);
      this.close();
    }
  }

  close() {
    this.modalService.hide();
  }

  onClear() {
    this.reset();
  }

  onCancel() {
    this.reset();
    this.cancel.emit({});
  }

  validationMessage(fieldName: string = ''): string | null {
    if (!this.form.get(fieldName)?.valid) {
      return "This field is invalid."
    }
    return null;
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

  isDisableSubmitButton() {
    return !this.form.get('reconMetricId')?.valid || this.reconBzdfPoints.length === 0 ||
           !this.form.get('glClass')?.valid || !this.getGlClassDescription() ||
           !this.form.get('productCode')?.valid || !this.getProductDescription()
  }

  /**
   * Product
   */

  private filterProduct(value: string) {
    return this.editionService.search({
      model: 'Product',
      data: {
        productCode: value,
        productDescription: value
      },
      searchOptions: {
        limit: 10
      }
    }).pipe(
      tap(() => {
        this.loadingStatus['productCode'] = false;
      }),
      map((response: ResponseModel) => response.data)
    );
  }

  displayProductFn(item: any): string {
    return item && item.productCode ? item.productCode : '';
  }

  getProductDescription() {
    const selected = this.form.get('productCode')?.value;
    if (selected) {
      return selected.productDescription || null
    }
    return null;
  }

  /**
   * glClass
   */

  private filterGlClass(value: string) {
    return this.editionService.search({
      model: 'DomsGlClass',
      data: {
        domain: value,
        domainDesc: value
      },
      searchOptions: {
        limit: 10
      }
    }).pipe(
      tap(() => {
        this.loadingStatus['glClass'] = false;
      }),
      map((response: ResponseModel) => response.data),
      tap(item => {
        item.glClass = item.domain;
      })
    );
  }

  displayClassFn(item: any): string {
    return item && item.domain ? item.domain : '';
  }

  getGlClassDescription() {
    const selected = this.form.get('glClass')?.value;
    if (selected) {
      return selected.domainDesc || null
    }
    return null;
  }

  add() {
    if (!this.isDisableAddButton()) {
      this.reconBzdfPoints.push({
        reconBzdfMapId: this.form.get('reconBzdfMapId')?.value?.reconBzdfMapId,
        reconBzdfMap: this.form.get('reconBzdfMapId')?.value,
        mathOperatorId: this.form.get('mathOperatorId')?.value?.mathOperatorId,
        mathOperator: this.form.get('mathOperatorId')?.value.mathOperator
      });
      this.resetFields(['reconBzdfMapId', 'mathOperatorId']);
    }
  }

  delete(element: any) {
    this.reconBzdfPoints.splice(element, 1);
  }

  isDisableAddButton() {
    return !this.form.get('reconBzdfMapId')?.valid || !this.form.get('mathOperatorId')?.valid;
  }

  parse(model: any) {
    model.productCode = model.product;
    model.glClass = model.domsGlClass;
    return model;
  }

}
