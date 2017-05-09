import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { OptionComponent } from './option.component';

@Component({
  selector: 'uz-select',
  styleUrls: ['./select.component.css'],
  templateUrl: './select.component.html'
})

export class SelectComponent implements OnInit {
  static instanceNum: number  = 0;

  @Input() label: string = 'Choose';
  @Input() multiple: boolean = false;
  @Output() change = new EventEmitter<string[]>();

  expanded: boolean = false;
  toggleId: string;
  optionsId: string;
  options: OptionComponent[] = [];

  private toggleElement: HTMLElement;
  private searchTimeout: number;
  private searchString: string = '';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.toggleId = `uz-toggle-${SelectComponent.instanceNum}`;
    this.optionsId = `uz-options-${SelectComponent.instanceNum}`;
    this.label = 'foobar';
    this.toggleElement = this.elementRef.nativeElement.querySelector('.uz-select-toggle') as HTMLElement;

    SelectComponent.instanceNum ++;
  }

  get value(): string[] {
    return this.options
      .filter(option => option.selected)
      .map(option => option.value);
  }

  @HostListener('keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    clearTimeout(this.searchTimeout);

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
      case 32: // space
        if (this.searchString.length) {
          e.preventDefault();
        } else {
          break;
        }
      default:
        this.searchForString(e);
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

  private searchForString(e: KeyboardEvent): boolean {
    const k = e.keyCode;
    const isSpace = k === 32;
    const isAlphaNumeric = (k >= 48 && k <= 90) || (k >= 96 && k <= 105);
    const isSpecialCharacter = (k >= 106 && k <= 111) || (k >= 186 && k <= 222);

    // If the keyCode is a character
    if (isSpace || isAlphaNumeric || isSpecialCharacter) {
      // When pressing the same character more than once, cycle through labels that begin with said character
      this.searchString = e.key === this.searchString ? this.searchString : this.searchString + e.key;

      // After a period of time, clear our search string, assuming the user has finished typing
      this.searchTimeout = setTimeout(() => {
        this.searchString = '';
      }, 500);

      const selected = this.options.filter(option => option.selected);
      const startingIndex = selected.length ? this.options.indexOf(selected[0]) : 0;
      const optionsAfterFocused = this.options.slice(startingIndex + 1);
      const optionsBeforeFocused = this.options.slice(0, startingIndex);

      return this.toggleFirstMatchingOption(optionsAfterFocused) ||
        this.toggleFirstMatchingOption(optionsBeforeFocused);
    }

    return false;
  }

  private matchingResults(option: OptionComponent) {
    return typeof option.label === 'string' && option.label.length > 0 && this.searchString.length > 0 &&
      option.label.substr(0, this.searchString.length).toLowerCase() === this.searchString.toLowerCase();
  }

  private toggleFirstMatchingOption(options: OptionComponent[]): boolean {
    const results = options.filter(option => this.matchingResults(option));
    if (results.length) {
      results[0].toggle();
    }

    return results.length > 0;
  }
}
