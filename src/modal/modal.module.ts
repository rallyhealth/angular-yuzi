import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

import { ModalComponent } from './modal.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [ModalComponent],
  declarations: [ModalComponent]
})

export class ModalModule {}
