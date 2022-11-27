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
import { AppUtils } from 'src/app/utils/AppUtils';
import { environment } from 'src/environments/environment';
import { BaseFormComponent } from '../../../shared/components/base-form/base-form.component';
import { AlertService } from '../../../shared/services/alert.service';
import { OptionsService } from '../../../shared/services/options.service';
import { ProgressService } from '../../../shared/services/progress.service';
import { AccessControlService } from '../../services/access-control.service';

@Component({
  selector: 'app-access-control-form',
  templateUrl: './access-control-form.component.html',
  styleUrls: ['./access-control-form.component.scss'],
  preserveWhitespaces: true
})
export class AccessControlFormComponent extends BaseFormComponent implements OnInit {
  
  @Input() editionMode: ('list' | 'create' | 'edit' | 'copy') = 'edit';
  @Input() modelEdit!: Model;
  @Output() cancel = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  // loadingStatus
  loadingStatus: any = [];

  // modal dimension group
  // @Input() editionModeMetric: ('list' | 'create' | 'edit' | 'copy') = 'edit';
  // @Input() modelEditMetric!: Model;
  // @Output() cancelMetric = new EventEmitter<any>();
  // @Output() saveMetric = new EventEmitter<any>();

  // user
  user: any;
  allUsers$!: Observable<any>| undefined;
  
  // roles
  roles: any = [];
  //   { name: 'admin', description: 'Administrator' },
  //   { name: 'admin2', description: 'Administrator test 2' },
  //   { name: 'admin3', description: 'Administrator test 3' }
  // ];
  allRoles$!: Observable<any>| undefined;

  // permissions
  permissions: any = [];
  allPermissions$!: Observable<any>| undefined;

  userStepCtrl = this.formBuilder.group({});
  roleStepCtrl = this.formBuilder.group({});
  permissionStepCtrl = this.formBuilder.group({});
  // accessControlMetricStepCtrl = this.formBuilder.group({});

  // modal
  // modalRef?: BsModalRef;
  
  constructor(
    optionsService: OptionsService,
    alertService: AlertService,
    progressService: ProgressService,
    private modalService: BsModalService,
    private editionService: EditionService,
    private accessControlService: AccessControlService
  ) {
    super(optionsService, alertService, progressService);
    alertService = alertService;
  }
  
  override ngOnInit(): void {
    this.model = this.modelEdit;
    this.roles = (this.model as any)?.roles || [];
    this.permissions = (this.model as any)?.permissions || [];
    this.initForm();
    this.form.addControl('userFormCtrl', new FormControl('', Validators.required))
    this.form.get('userFormCtrl')?.patchValue(this.model);
    this.form.addControl('roleFormCtrl', new FormControl('', Validators.required))
    this.form.addControl('permissionFormCtrl', new FormControl('', Validators.required))
    if (this.editionMode === 'edit') {
      this.form.get('userFormCtrl')?.disable();
    }
    // user
    this.allUsers$ = this.form.get('userFormCtrl')?.valueChanges.pipe(
      tap(() => {
        this.loadingStatus['userFormCtrl'] = true;
      }),
      distinctUntilChanged(),
      debounceTime(400),
      filter((value) => !!value),
      switchMap(value => this.filterUser(value))
    );
    // role
    this.allRoles$ = this.form.get('roleFormCtrl')?.valueChanges.pipe(
      tap(() => {
        if (this.form.get('roleFormCtrl')?.value) {
          this.loadingStatus['roleFormCtrl'] = true;
        }
      }),
      distinctUntilChanged(),
      debounceTime(400),
      filter((value) => !!value),
      switchMap(value => this.filterItems('role', value))
    );
    // permission
    this.allPermissions$ = this.form.get('permissionFormCtrl')?.valueChanges.pipe(
      tap(() => {
        if (this.form.get('permissionFormCtrl')?.value) {
          this.loadingStatus['permissionFormCtrl'] = true;
        }
      }),
      distinctUntilChanged(),
      debounceTime(400),
      filter((value) => !!value),
      switchMap(value => this.filterItems('permission', value))
    );
  }
  
  override submit(): void {
    this.save.emit(this.parseToSave());
  }

  private parseToSave() {
    return {
      userId: this.form.get('id')?.value || this.form.get('userFormCtrl')?.value?.id,
      roles: this.roles.map((i: any) => (i.id)),
      permissions: this.permissions.map((i: any) => (i.id))
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
   * User
   */

  private filterUser(value: string) {
    return this.editionService.search({
      model: 'User',
      data: {
        username: value,
        firstName: value
      },
      searchOptions: {
        limit: 10
      }
    }).pipe(
      tap(() => {
        this.loadingStatus['userFormCtrl'] = false;
      }),
      map((response: ResponseModel) => response.data)
    );
  }

  displayUserFn(user: any): string {
    return user && user.username ? user.username : '';
  }

  getUserFullName() {
    const firstName = this.form.get('firstName')?.value || this.form.get('userFormCtrl')?.value?.firstName || null;
    const lastName = this.form.get('lastName')?.value || this.form.get('userFormCtrl')?.value?.lastName || null;
    return lastName ? `${firstName} ${lastName}` : firstName
  }

  /**
   * Autocomplete + grid actions
   */

  private filterItems(model: string, value: string) {
    return this.editionService.search({
      model: AppUtils.capitalizeFirstLatter(model),
      data: {
        name: value,
        description: value
      },
      searchOptions: {
        limit: 10
      }
    }).pipe(
      tap(() => {
        this.loadingStatus[model + 'FormCtrl'] = false;
      }),
      map((response: ResponseModel) => response.data)
    );
  }

  displayItemFn(item: any): string {
    return item && item.name ? item.name : '';
  }

  getItemDescription(model: string) {
    const selected = this.form.get(model + 'FormCtrl')?.value;
    if (selected) {
      return selected.description || null
    }
    return null;
  }

  onAddItem(model: string) {
    if (!this.isDisableAddItemButton(model)) {
      const listName = model + 's';
      // exists verification
      const newRole = Object.assign(this.form.get(model + 'FormCtrl')?.value)
      const existsValidation = (this as any)[listName].filter((i: any) => i.name === newRole.name).length > 0;
      if (existsValidation) {
        this.alertService.toastError('Item already added.');
        return;
      }
      if (this.form.get(model + 'FormCtrl')?.valid) {
        (this as any)[listName].push(newRole);
      }
      this.clearRoleFields(model);
    }
  }

  isDisableAddItemButton(model: string) {
    return !this.form.get(model + 'FormCtrl')?.valid;
  }

  onRemoveItem(model: string, element: any) {
    const listName = model + 's';
    (this as any)[listName].splice(element, 1);
  }
  
  clearRoleFields(model: string) {
    this.form.get(model + 'FormCtrl')?.setValue(null);
    this.form.get(model + 'FormCtrl')?.clearValidators();
    this.form.get(model + 'FormCtrl')?.updateValueAndValidity();
  }

  checkFormValidation(): boolean {
    if (this.roles.length === 0 && this.permissions.length === 0) {
      return false;
    }
    return true;
  }

}
