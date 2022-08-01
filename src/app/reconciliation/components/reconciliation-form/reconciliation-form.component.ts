import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged, filter, map, Observable, startWith, switchMap, take, tap } from 'rxjs';
import { EditionService } from 'src/app/edition/services/edition.service';
import { Model, Relationship } from 'src/app/model/Model';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { environment } from 'src/environments/environment';
import { BaseFormComponent } from '../../../shared/components/base-form/base-form.component';
import { AlertService } from '../../../shared/services/alert.service';
import { OptionsService } from '../../../shared/services/options.service';
import { ProgressService } from '../../../shared/services/progress.service';
import { ReconciliationService } from '../../services/reconciliation.service';

@Component({
  selector: 'app-reconciliation-form',
  templateUrl: './reconciliation-form.component.html',
  styleUrls: ['./reconciliation-form.component.scss'],
  preserveWhitespaces: true
})
export class ReconciliationFormComponent extends BaseFormComponent implements OnInit {
  
  @Input() editionMode: ('list' | 'create' | 'edit' | 'copy') = 'edit';
  @Input() modelEdit!: Model;
  @Output() cancel = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  // loadingStatus
  loadingStatus: any = [];

  // modal dimension group
  @Input() editionModeMetric: ('list' | 'create' | 'edit' | 'copy') = 'edit';
  @Input() modelEditMetric!: Model;
  @Output() cancelMetric = new EventEmitter<any>();
  @Output() saveMetric = new EventEmitter<any>();
  
  // views
  reconDimensions: any = [];

  // account
  reconGlPoints: any = [];
  accountCodeMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  // separatorKeysCodes: number[] = [ENTER, COMMA];
  // filteredAccounts!: Observable<any[]> | undefined;
  allAccounts$!: Observable<any>| undefined;

  accountStepCtrl = this.formBuilder.group({});
  reconciliationMetricStepCtrl = this.formBuilder.group({});

  // modal
  modalRef?: BsModalRef;
  
  constructor(
    optionsService: OptionsService,
    alertService: AlertService,
    progressService: ProgressService,
    private modalService: BsModalService,
    private editionService: EditionService,
    private reconciliationService: ReconciliationService
  ) {
    super(optionsService, alertService, progressService);
    alertService = alertService;
  }
  
  override ngOnInit(): void {
    this.model = this.modelEdit;
    this.initForm();
    this.form.addControl('accountFormCtrl', new FormControl('', Validators.required))
    if (this.editionMode === 'edit') {
      this.form.get(this.modelEdit.idField)?.disable();
    }
    this.allAccounts$ = this.form.get('accountFormCtrl')?.valueChanges.pipe(
      tap(() => {
        if (this.form.get('accountFormCtrl')?.value) {
          this.loadingStatus['accountFormCtrl'] = true;
        }
      }),
      distinctUntilChanged(),
      debounceTime(400),
      filter((value) => !!value),
      switchMap(value => this.filterAccounts(value))
    );
  }
  
  override submit(): void {
    this.save.emit(this.parseToSave());
  }

  private parseToSave() {
    return {
      reconGlPoints: this.reconGlPoints.map((a: any) => ({glAccountCode: a.glAccountCode})),
      reconDimensions: this.reconDimensions
    }
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

  /**
   * Account
   */

  private filterAccounts(value: string) {
    return this.editionService.search({
      model: 'GenldgAccountPlan',
      data: {
        glAccountCode: value,
        glAccountName: value
      },
      searchOptions: {
        limit: 10
      }
    }).pipe(
      tap(() => {
        this.loadingStatus['accountFormCtrl'] = false;
      }),
      map((response: ResponseModel) => response.data)
    );
  }

  displayAccountFn(account: any): string {
    return account && account.glAccountCode ? account.glAccountCode : '';
  }

  getAccountDescription() {
    const selected = this.form.get('accountFormCtrl')?.value;
    if (selected) {
      return selected.glAccountName || null
    }
    return null;
  }

  onAddAccount() {
    if (!this.isDisableAddAccountButton()) {
      // exists verification
      const newAccount = Object.assign(this.form.get('accountFormCtrl')?.value)
      const existsValidation = this.reconGlPoints.filter((i: any) => i.glAccountCode === newAccount.glAccountCode).length > 0;
      if (existsValidation) {
        this.alertService.toastError('Item already added.');
        return;
      }
      if (this.form.get('accountFormCtrl')?.valid) {
        this.reconGlPoints.push(newAccount);
      }
      this.clearAccountFields();
    }
  }

  isDisableAddAccountButton() {
    return !this.form.get('accountFormCtrl')?.valid || !this.getAccountDescription();
  }

  onRemoveAccount(element: any) {
    this.reconGlPoints.splice(element, 1);
  }
  
  clearAccountFields() {
    this.form.get('accountFormCtrl')?.setValue(null);
    this.form.get('accountFormCtrl')?.clearValidators();
    this.form.get('accountFormCtrl')?.updateValueAndValidity();
  }

  /**
   * Actions for Recon Dimensions
   */
  
  onEditReconDimension(modalTemplate: any, element: any) {
    element.index = this.reconDimensions.indexOf(element);
    this.openModalMetric(modalTemplate, 'edit', element);
  }

  onRemoveReconDimension(element: any) {
    this.reconDimensions.splice(element, 1);
  }

  /**
   * MODAL RECON DIMENSIONS
   */
  openModalMetric(template: TemplateRef<any>, editionModeModal: ("list" | "create" | "edit" | "copy"), element: any) {
    // define initial variables
    this.editionModeMetric = editionModeModal;
    // get attributes
    this.editionService.getAttributes({model: 'ReconDimension'}).subscribe((modelDimension: any) => {
      this.editionService.getAttributes({model: 'ReconBzdfPoint'}).subscribe((modelPoint: any) => {
        this.modelEditMetric = modelDimension as any;
        this.modelEditMetric?.fields?.push.apply(this.modelEditMetric?.fields, modelPoint.fields);
        // build object
        this.modelEditMetric = { ...this.modelEditMetric, ...element };
        // open dialog 
        const config: ModalOptions<any> = {
          class: 'modal-lg',
          keyboard: false,
          ignoreBackdropClick: true
        };
        this.modalRef = this.modalService.show(template, config);
      });
    });
  }
  
  closeModalMetric(template: TemplateRef<any>) {
    this.modalService.hide();
  }

  onModalReconMetricSave(modelEdit: any) {
    if (typeof modelEdit.index === 'number') {
      this.reconDimensions[modelEdit.index] = modelEdit;
    } else {
      this.reconDimensions.push(modelEdit);
    }
  }

}
