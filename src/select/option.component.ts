import { Component, ElementRef, Host, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SelectComponent } from './select.component';

@Component({
  selector: 'uz-option',
  styleUrls: ['./option.component.css'],
  templateUrl: './option.component.html'
})

export class OptionComponent implements OnInit, OnDestroy {
  @Input() value: any;
  @Input() disabled: boolean = false;
  @ViewChild('button') button: ElementRef;

  private _selected: boolean = false;
  private _label: string;
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

  ngOnDestroy() {
    this.selectComponent.removeOption(this);
  }

  @HostListener('keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 13: // return
      case 32: // space
        this.select();
        e.preventDefault();
        break;
      default:
        return;
    }
  }

  focus() {
    this.button.nativeElement.focus();
  }

  select() {
    this.selected = true;
    this.selectComponent.change.emit(this.selectComponent.value);
    this.selectComponent.close();
  }

  @Input()
  set label(label: any) {
    this._label = label;
  }

  get label(): any {
    return typeof this._label !== 'undefined' ? this._label : this.button.nativeElement.textContent;
  }

  @Input()
  set selected(selected: boolean) {
    if (selected) {
      this.selectComponent.deselectAllOptions();
    }

    this._selected = selected;
  }

  get selected(): boolean {
    return this._selected;
  }

  get index(): number {
    return this.selectComponent.options.indexOf(this);
  }
}
