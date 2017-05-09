import { Component, Input, OnInit } from '@angular/core';

import { AbstractValueAccessor, MakeProvider } from '../shared/abstract-value-accessor';

@Component({
  selector: 'uz-radio',
  styleUrls: ['./radio.component.css'],
  templateUrl: './radio.component.html',
  providers: [MakeProvider(RadioComponent)]
})

export class RadioComponent extends AbstractValueAccessor implements OnInit {
  static instanceNum: number = 0;

  @Input() name: string;
  @Input('value') radioValue: any;
  @Input() checked: boolean;

  id: string;

  ngOnInit() {
    this.id = `${this.name}-${RadioComponent.instanceNum}`;

    RadioComponent.instanceNum ++;
  }
}
