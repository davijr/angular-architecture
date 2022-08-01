import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { GlAccountService } from '../../services/gl-account.service';
import { ReconciliationService } from '../../services/reconciliation.service';

@Component({
  selector: 'app-reconciliation-tool',
  templateUrl: './reconciliation-tool.component.html',
  styleUrls: ['./reconciliation-tool.component.scss']
})
export class ReconciliationToolComponent implements OnInit {

  // views
  @ViewChild('accountInput') accountInput!: ElementRef<HTMLInputElement>;

  // default
  separatorKeysCodes: number[] = [ENTER, COMMA];
  accountFormCtrl = new FormControl('');
  filteredAccounts!: Observable<string[]>;

  dimensionGroups: any = [];
  glAccounts: any = [];

  constructor(
    private reconciliationService: ReconciliationService,
    private glAccountService: GlAccountService
  ) { }

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    this.dimensionGroups = this.reconciliationService.findAccounts();
  }

  /**
   * Account
   */

  onSearchAccount() {
    this.glAccounts = this.glAccountService.find({})
  }

  addAccount(event: MatChipInputEvent) {
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

}
