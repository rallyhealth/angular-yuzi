import { Component, ElementRef, HostListener, Input, OnInit, Output } from '@angular/core';

import { OptionComponent } from './option.component';

@Component({
  selector: 'uz-select',
  styleUrls: ['./select.component.css'],
  templateUrl: './select.component.html'
})

export class SelectComponent implements OnInit {
  @Input() label: string = 'Choose';
  @Input() multiple: boolean = false;

  expanded: boolean = false;
  toggleId: string;
  optionsId: string;
  options: OptionComponent[] = [];

  private toggleElement: HTMLElement;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const id = Date.now();
    this.toggleId = `uz-toggle-${id}`;
    this.optionsId = `uz-options-${id}`;
    this.label = 'foobar';
    this.toggleElement = this.elementRef.nativeElement.querySelector('.uz-select-toggle') as HTMLElement;
  }

  @Output()
  get value(): string[] | string {
    const values = this.options
      .filter(option => option.selected)
      .map(option => option.value);

    return this.multiple ? values : values[0];
  }

  @HostListener('keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 40: // down arrow
        this.nextOption(e);
        break;
      case 38: // up arrow
        this.prevOption(e);
        break;
      case 27: // escape
        this.close();
        e.preventDefault();
        break;
      default: return;
    }
  }

  get toggleText(): string {
    const labels = this.options
      .filter(option => option.selected)
      .map(option => option.label || option.value);

    return !labels.length || this.multiple ? this.label : labels[0];
  }

  close() {
    this.expanded = false;
    this.toggleElement.focus();
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  addOption(option: OptionComponent) {
    option.index = this.options.length;
    this.options.push(option);
  }

  deselectAllOptions() {
    this.options.forEach(option => {
      option.selected = false;
    });
  }

  private nextOption(e: KeyboardEvent) {
    const focusedIndex = this.getFocusedIndex();
    const lastIndex = this.options.length - 1;
    e.preventDefault();
    this.expanded = true;

    if (focusedIndex < lastIndex) {
      const nextOption = this.options[focusedIndex + 1];
      setTimeout(() => nextOption.focus());
    }
  }

  private prevOption(e: KeyboardEvent) {
    const focusedIndex = this.getFocusedIndex();
    e.preventDefault();

    if (focusedIndex > 0) {
      const prevOption = this.options[focusedIndex - 1];
      setTimeout(() => prevOption.focus());
    } else {
      this.close();
    }
  }

  private getFocusedIndex(): number {
    const active = this.options.filter(option => option.button === document.activeElement);
    return active.length ? active[0].index : -1;
  }
}
