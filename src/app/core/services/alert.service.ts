import { Injectable, RendererFactory2 } from '@angular/core';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private modalService: BsModalService) {}

  error(bsModalRef: BsModalRef, message: string) {
    bsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = 'danger';
    bsModalRef.content.message = message;
  }

  info(bsModalRef: BsModalRef, message: string) {
    bsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = 'info';
    bsModalRef.content.message = message;
  }

  success(bsModalRef: BsModalRef, message: string) {
    bsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = 'success';
    bsModalRef.content.message = message;
  }

}
