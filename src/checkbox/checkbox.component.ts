import { Component, Input, OnInit } from '@angular/core';

import { AbstractValueAccessor, MakeProvider } from '../shared/abstract-value-accessor';
import { IconsService } from '../shared/icons.service';

@Component({
  selector: 'uz-checkbox',
  styleUrls: ['./checkbox.component.css'],
  templateUrl: './checkbox.component.html',
  providers: [MakeProvider(CheckboxComponent)]
})

export class CheckboxComponent extends AbstractValueAccessor implements OnInit {
  static instanceNum: number = 0;

  @Input() name: string;
  @Input('value') checkboxValue: any;
  @Input() checked: boolean;

  checkIconClass: string;
  id: string;

  constructor(private icons: IconsService) {
    super();
    this.checkIconClass = icons.check;
  }

  ngOnInit() {
    this.id = `${this.name}-${CheckboxComponent.instanceNum}`;

    CheckboxComponent.instanceNum ++;
  }
}
