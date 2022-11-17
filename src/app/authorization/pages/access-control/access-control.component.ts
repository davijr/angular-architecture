import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDrawer } from '@angular/material/sidenav';
import { catchError, map, Observable, of, startWith, Subject } from 'rxjs';
import { UserService } from 'src/app/authentication/services/user.service';
import { EditionService } from 'src/app/edition/services/edition.service';
import { Model } from 'src/app/model/Model';
import { ModelUtils } from 'src/app/model/utils/ModelUtils';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { SearchOptions } from 'src/app/model/utils/SearchOptions';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { AccessControlService } from '../../services/access-control.service';
import { GlAccountService } from '../../services/gl-account.service';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})
export class AccessControlComponent implements OnInit {

  modelName = 'User'

  @ViewChild('drawer') drawer!: MatDrawer;

  editionMode: ('list' | 'create' | 'edit' | 'copy') = 'list';

  model!: any;
  modelEdit: any;

  items$: Observable<any[]> = new Observable<any[]>();
  itemsWithoutFilters$: Observable<any[]> = new Observable<any[]>();
  error$ = new Subject<boolean>();

  // views
  @ViewChild('accountInput') accountInput!: ElementRef<HTMLInputElement>;

  // default
  separatorKeysCodes: number[] = [ENTER, COMMA];
  accountFormCtrl = new FormControl('');
  filteredAccounts!: Observable<string[]>;
  allAccounts: string[] = [];
  
  // TODO SearchOptions
  searchOptions: SearchOptions = {
    page: 1,
    limit: 10,
    order: 'desc',
    orderBy: 'systemType'
  }

  dimensionGroups: any = [];
  glAccounts: any = [];

  constructor(
    private editionService: EditionService,
    private userService: UserService,
    private accessControlService: AccessControlService,
    private glAccountService: GlAccountService,
    private progressService: ProgressService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.editionService.getAttributes({model: this.modelName}).subscribe(model => {
      this.model = model as any;
      if (!this.model) {
        this.alertService.modalError("There is no valid model selected.");
      } else {
        // this.buildFilterFields();
        this.onRefresh();
      }
    });

    // accounts
    this.filteredAccounts = this.accountFormCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allAccounts.slice())),
    );
  }

  onRefresh() {
    if (this.drawer) {
      this.drawer.close();
    }
    this.progressService.showLoading();
    // this.clearFilter();
    const requestModel: RequestModel = {
      model: this.model.name,
      data: this.model,
      searchOptions: this.searchOptions
    };
    this.items$ = this.userService.find()
      .pipe(
        map((response: any) => response.data),
        catchError(error => {
          console.error('error', error)
          this.alertService.toastError("Error on getting data.")
          return of([])
        })
      );
    this.items$.subscribe({ complete: () => this.progressService.hideLoading() });
    this.itemsWithoutFilters$ = this.items$;
  }

  /** Basic methods for edition form */

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

  onSave(modelEdit: any) {
    this.progressService.showLoading();
    if (['create', 'copy'].includes(this.editionMode)) {
      this.accessControlService.create({data: modelEdit}).subscribe(this.performAction('Create'));
    } else if ('edit' === this.editionMode) {
      this.accessControlService.create({data: modelEdit}).subscribe(this.performAction('Update'));
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
    this.accessControlService.delete({data: this.modelEdit.reconDimensionGroup}).subscribe(this.performAction('Delete'));
  }

  onCancel(event: any) {
    this.onExitEditMode();
    this.drawer.close();
  }

  onExitEditMode() {
    this.editionMode = 'list';
    this.modelEdit = Object.assign({});
  }

  /**
   * Account
   */

  onSearchAccount() {
    // this.glAccounts = this.glAccountService.find({})
  }

  onAddAccount(event: MatChipInputEvent) {
    // search
    this.onSearchAccount();
    console.log('groups', this.dimensionGroups);
    debugger
  }

  onRemove() {
    // const index = this.fruits.indexOf(fruit);

    // if (index >= 0) {
    //   this.fruits.splice(index, 1);
    // }
  }

  onSelectAccount(event: MatAutocompleteSelectedEvent) {
    // add
    console.log('groups', this.dimensionGroups);
    debugger
  }

  onClearAccountSelection() {
    this.accountInput.nativeElement.value = '';
    this.accountFormCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.glAccounts.filter((account: any) => account.toLowerCase().includes(filterValue));
  }

  /** Auxiliares */

  beautifyName(name?: string) {
    return name?.replace(/([A-Z])/g, ' $1').trim().toUpperCase() ?? '';
  }

  performAction(actionName: string) {
    return {
      next: () => this.alertService.toastSuccess(`${actionName} action performed with success!`),
      error: (error: any) => {
        this.alertService.toastError(`${actionName} action performed with error! ${error.message}`);
        this.progressService.hideLoading();
      },
      complete: () => {
        this.onRefresh();
        this.progressService.hideLoading();
        this.drawer.close();
      }
    }
  }

}
