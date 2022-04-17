import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, of, Subject, Subscription } from 'rxjs';
import { DomsSystemType } from 'src/app/model/doms/DomsSystemType';
import { EditionModelEnum } from 'src/app/model/enum/EditionModelEnum';
import { Item } from 'src/app/model/Item';
import { SysExternalSystem } from 'src/app/model/sys/SysExternalSystem';
import { Model } from 'src/app/model/utils/Model';
import { RequestModel } from 'src/app/model/utils/RequestModel';
import { ResponseModel } from 'src/app/model/utils/ResponseModel';
import { AlertService } from 'src/app/shared/services/alert.service';
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
  editionMode: ('list' | 'edit') = 'list';

  model!: Model;
  modelEdit?: Model;

  items$: Observable<Model[]> = new Observable();
  error$ = new Subject<boolean>();

  constructor(
    private editionService: EditionService,
    private alertService: AlertService,
    private route: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: any) => {
      this.selectModel(params['editionModel']);
      this.onRefresh();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  selectModel(editionModelSelected: string) {
    switch(editionModelSelected) {
      case (EditionModelEnum.SysExternalSystem): this.model = new SysExternalSystem(); break;
      case (EditionModelEnum.DomsSystemType): this.model = new DomsSystemType(); break;
      default: console.error("ERROR! Model not found."); break;
    }
  }

  onRefresh() {
    const requestModel: RequestModel = {
      model: this.model?.constructor.name,
      data: this.model,
      searchOptions: {
        page: 1,
        limit: 10,
        order: 'desc'
      }
    };
    this.items$ = this.editionService.list(requestModel)
      .pipe(
        map((response: ResponseModel) => response.data),
        catchError(error => {
          console.error('error', error)
          this.handleError()
          return of()
        })
    )
  }

  onCreate(): void {
    this.editionMode = 'edit';
    this.parseModel(this.model);
    this.drawer.toggle();
  }

  onEdit(item: Model): void {
    this.editionMode = 'edit';
    this.parseModel(item);
    this.drawer.toggle();
  }

  onExitEditMode() {
    // this.selectModel();
    this.editionMode = 'list';
    this.modelEdit = undefined;
  }

  onSave() {
    console.log('agooora vai !!!')
  }

  private parseModel(item: any) {
    const newModel: any = Object.assign({}, this.model);
    Object.keys(item).forEach((keyName: any) => {
      newModel[keyName] = item[keyName];
    });
    this.modelEdit = newModel;
  }

  onDelete(item: Item): void {
    this.alertService.modalInfo("Test message.")
  }

  onConfirmDelete() {}

  onDeclineDelete() {}

  handleError() {
    this.alertService.modalError("Error on getting data.")
    // this.alertService.toastError("Error on getting data.")
  }

  submit() {
    // console.log(this.form);

    // let valueSubmit = Object.assign({}, this.form.value);

    // valueSubmit = Object.assign(valueSubmit, {
    //   frameworks: valueSubmit.frameworks
    //     .map((v, i) => v ? this.frameworks[i] : null)
    //     .filter(v => v !== null)
    // })
  }

  beautifyName(name?: string) {
    return name?.replace(/([A-Z])/g, ' $1').trim().toUpperCase() ?? '';
  }

  getKeys(item: any, columnName: string) {
    return item[columnName];
  }

}
