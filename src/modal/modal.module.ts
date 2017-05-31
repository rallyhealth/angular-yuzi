import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/pairwise';

import { ModalRouteComponent } from './modal-route.component';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [ModalComponent, ModalRouteComponent],
  declarations: [ModalComponent, ModalRouteComponent],
  providers: [ModalService]
})

export class ModalModule {}
