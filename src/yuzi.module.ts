import { NgModule } from '@angular/core';

import { CheckboxModule } from './checkbox/checkbox.module';
import { ModalModule } from './modal/modal.module';
import { RadioModule } from './radio/radio.module';
import { SelectModule } from './select/select.module';
import { SharedModule } from './shared/shared.module';

const yuziModules = [
  CheckboxModule,
  ModalModule,
  RadioModule,
  SelectModule,
  SharedModule
];

@NgModule({
  imports: yuziModules,
  exports: yuziModules
})

export class YuziModule {}
