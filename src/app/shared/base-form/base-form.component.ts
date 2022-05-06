import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { Field, Model, Relationship } from 'src/app/model/Model';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { AlertService } from '../services/alert.service';
import { OptionsService } from '../services/options.service';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  model!: Model;
  form!: FormGroup;
  relationships: Relationship[] = [];

  formBuilder = new FormBuilder();

  constructor(
    private optionsService: OptionsService,
    private alertService: AlertService,
    private progressService: ProgressService
  ) {
    this.optionsService = optionsService;
    this.alertService = alertService;
    this.progressService = progressService;
  }

  ngOnInit(): void {}

  initForm() {
    this.buildFormGroup();
    this.getRelationships();
    this.setValues();
  }

  abstract submit(model: any): void;

  onSubmit(): void {
    if (this.form.valid) {
      this.submit(this.form.getRawValue());
    } else {
      this.alertService.toastError("There is validations errors. Please, verify the fields.");
      this.verifyFormValidations(this.form);
    }
  }

  buildFormGroup() {
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
    this.form = this.formBuilder.group(formGroup);
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

  setValues() {
    this.form.patchValue(this.model);
  }

  // #### VALIDATIONS ####

  verifyFormValidations(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field) ?? new FormControl();
      control.markAsDirty();
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.verifyFormValidations(control);
      }
    });
  }

  reset() : void {
    this.form.reset();
  }

  verifyValidTouched(fieldName: string) {
    return (
      !this.form.get(fieldName)?.valid &&
      (this.form.get(fieldName)?.touched || this.form.get(fieldName)?.dirty)
    );
  }

  verifyRequiredError(fieldName: string) {
    return (
      this.form.get(fieldName)?.hasError('required') &&
      (this.form.get(fieldName)?.touched || this.form.get(fieldName)?.dirty)
    );
  }

  verifyInvalidEmail() {
    const email = this.form.get('email');
    if (email?.errors) {
      return email.errors['email'] && email.touched;
    }
  }

  isRequired(fieldName: string) {
    return this.form.get(fieldName)?.hasValidator(Validators.required);
  }

  applyCssError(fieldName: string) {
    return {
      'is-invalid': this.verifyValidTouched(fieldName)
    };
  }

}
