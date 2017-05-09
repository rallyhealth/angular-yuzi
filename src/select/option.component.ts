import { Component, ElementRef, Host, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { SelectComponent } from './select.component';

@Component({
  selector: 'uz-option',
  styleUrls: ['./option.component.css'],
  templateUrl: './option.component.html'
})

export class OptionComponent implements OnInit {
  @Input() label: string;
  @Input() value: any;
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @ViewChild('button') button: ElementRef;

  index: number;

  private selectComponent: SelectComponent;

  constructor(@Host() select: SelectComponent) {
    this.selectComponent = select;
  }

  ngOnInit() {
    this.selectComponent.addOption(this);

    if (typeof this.selected === 'undefined') {
      this.selected = false;
    } else if (typeof this.selected === 'string') {
      this.selected = true;
    }
  }

  @HostListener('keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 13: // return
      case 32: // space
        this.select();
        e.preventDefault();
        break;
      default: return;
    }
  }

  focus() {
    this.button.nativeElement.focus();
  }

  select() {
    this.selectComponent.deselectAllOptions();
    this.selected = true;
    this.selectComponent.change.emit(this.selectComponent.value);
    this.selectComponent.close();
  }
}
