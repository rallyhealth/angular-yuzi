import { Component, ElementRef, Host, HostListener, Input, OnInit } from '@angular/core';

import { SelectComponent } from './select.component';

@Component({
  selector: 'uz-option',
  styleUrls: ['./option.component.css'],
  templateUrl: './option.component.html'
})

export class OptionComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;

  index: number;
  button: HTMLElement;

  private select: SelectComponent;

  constructor(
    @Host() select: SelectComponent,
    private elementRef: ElementRef
  ) {
    this.select = select;
  }

  ngOnInit() {
    this.button = this.elementRef.nativeElement.querySelector('.uz-option') as HTMLElement;
    this.select.addOption(this);

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
        this.toggle();
        e.preventDefault();
        break;
      default: return;
    }
  }

  focus() {
    this.button.focus();
  }

  toggle() {
    if (this.select.multiple) {
      this.selected = !this.selected;
    } else {
      this.select.deselectAllOptions();
      this.selected = true;
    }

    this.select.change.emit(this.select.value);
    this.select.close();
  }
}
