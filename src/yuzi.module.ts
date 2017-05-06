import { NgModule } from '@angular/core';

import { ModalModule } from './modal/modal.module';
import { SelectModule } from './select/select.module';

const yuziModules = [
  ModalModule,
  SelectModule
];

@NgModule({
  imports: yuziModules,
  exports: yuziModules
})

export class YuziModule {}
