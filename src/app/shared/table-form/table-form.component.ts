import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Model, Relationship } from 'src/app/model/utils/Model';
import { environment } from 'src/environments/environment';
import { BaseFormComponent } from '../base-form/base-form.component';
import { AlertService } from '../services/alert.service';
import { OptionsService } from '../services/options.service';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss'],
  preserveWhitespaces: true
})
export class TableFormComponent extends BaseFormComponent implements OnInit {
  
  @Input() modelParam!: Model;
  @Output() save = new EventEmitter();
  
  readonly debugForms = environment.debugForms;
  
  constructor(
    optionsService: OptionsService,
    alertService: AlertService,
    progressService: ProgressService
  ) {
    super(optionsService, alertService, progressService);
  }
  
  override ngOnInit(): void {
    this.model = this.modelParam;
    this.initForm();
  }
  
  submit(): void {
    this.save.emit(this.form.value);
  }
  
  // onSubmit() {
  //   console.log('form.value', this.form.value)
  // }

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

}
