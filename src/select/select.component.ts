import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { OptionComponent } from './option.component';

@Component({
  selector: 'uz-select',
  styleUrls: ['./select.component.css'],
  templateUrl: './select.component.html'
})

export class SelectComponent implements OnInit {
  static instanceNum: number  = 0;
  @Output() static toggled: EventEmitter<SelectComponent> = new EventEmitter<SelectComponent>();

  @Input() label: string = 'Choose';
  @Output() change = new EventEmitter<any>();
  @ViewChild('toggleButton') toggleButton: ElementRef;

  @HostBinding('class.uz-select-open') expanded: boolean = false;
  toggleId: string;
  optionsId: string;
  options: OptionComponent[] = [];

  private instanceNum: number;
  private searchTimeout: number;
  private searchString: string = '';

  constructor() {}

  ngOnInit() {
    this.instanceNum = SelectComponent.instanceNum;
    this.toggleId = `uz-toggle-${this.instanceNum}`;
    this.optionsId = `uz-options-${this.instanceNum}`;
    this.label = 'foobar';

    SelectComponent.instanceNum ++;

    SelectComponent.toggled.subscribe((select: SelectComponent) => {
      if (select.toggleId !== this.toggleId) {
        this.expanded = false;
      }
    });
  }

  get value(): any {
    return typeof this.selected === 'undefined' ? undefined : this.selected.value;
  }

  get selected(): OptionComponent | undefined {
    return this.options.find(option => option.selected);
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
      case 9: // tab
        // If the user is tabbing out of the options menu, close the select dropdown
        if ((!e.shiftKey && this.getFocusedIndex() === this.options[this.options.length - 1].index) ||
          (e.shiftKey && this.getFocusedIndex() === 0)) {
          this.expanded = false;
        }
        break;
      case 32: // space
        if (this.searchString.length) {
          // purposeful fallthrough in switch
          e.preventDefault();
        } else {
          setTimeout(() => {
            if (this.selected && this.expanded) { this.selected.focus(); }
          }, 200);
          break;
        }
      default:
        this.searchForString(e);
    }
  }

  @HostListener('body:mouseup', ['$event'])
  bodyMouseup(event: MouseEvent) {
    if (!this.expanded) { return; }

    let clickedElement = event.target as HTMLElement;
    let inSelect = false;

    do {
      if (clickedElement === this.toggleButton.nativeElement) {
        inSelect = true;
      }
      clickedElement = clickedElement.parentNode as HTMLElement;
    } while (clickedElement);

    if (!inSelect) {
      this.expanded = false;
    }
  }

  get toggleText(): string {
    return this.selected ? this.selected.label : this.label;
  }

  close() {
    this.expanded = false;
    this.toggleButton.nativeElement.focus();
  }

  toggle() {
    this.expanded = !this.expanded;
    SelectComponent.toggled.emit(this);
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

    if (!this.expanded) {
      this.toggle();
    }

    if (focusedIndex < lastIndex) {
      const nextOption = this.options[focusedIndex + 1];
      setTimeout(() => nextOption.focus(), 50);
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
    const active = this.options.filter(option => option.button.nativeElement === document.activeElement);
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

      const startingIndex = typeof this.selected !== 'undefined' ? this.options.indexOf(this.selected) : 0;
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
      results[0].select();
    }

    return results.length > 0;
  }
}
