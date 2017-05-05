import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ModalService {
  status: ModalStatus;
  statusChange: Observable<ModalStatus>;

  private statusObserver: Observer<ModalStatus>;

  constructor() {
    this.statusChange = new Observable(observer => {
      this.statusObserver = observer;
    });
  }

  close() {
    this.updateStatus(ModalStatus.Closed);
  }

  private updateStatus(status: ModalStatus) {
    this.status = status;
    this.statusObserver.next(status);
  }
}

export enum ModalStatus {
  Open,
  Closed
}
