import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OptionComponent } from './option.component';
import { SelectComponent } from './select.component';

@NgModule({
  imports: [CommonModule],
  exports: [SelectComponent, OptionComponent],
  declarations: [SelectComponent, OptionComponent]
})

export class SelectModule {}
