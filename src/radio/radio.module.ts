import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RadioComponent } from './radio.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [RadioComponent],
  declarations: [RadioComponent]
})

export class RadioModule {}
