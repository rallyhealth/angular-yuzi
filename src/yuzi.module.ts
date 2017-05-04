import { NgModule } from '@angular/core';
import { ModalModule } from './modal/modal.module';

const yuziModules = [
  ModalModule
];

@NgModule({
  imports: yuziModules,
  exports: yuziModules
})

export class YuziModule {}
