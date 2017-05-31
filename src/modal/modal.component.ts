import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'uz-modal',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal.component.html'
})

export class ModalComponent implements AfterViewInit {

  /**
   * Gets all tab-able elements from within an HTML node
   * @param parent - topmost node to search within
   * @returns {HTMLElement[]}
   */
  protected static getTabElements(parent?: HTMLElement): HTMLElement[] {
    parent = parent || document.body;
    const possibilities = 'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    const elements: HTMLElement[] = [].slice.call(parent.querySelectorAll(possibilities));
    const tabElements = elements.filter(element => element.getAttribute('tabindex') !== '-1');

    return ModalComponent.filterVisibleElements(tabElements);
  }

  /**
   * Returns visible elements from a list of elements
   * @param elements
   * @returns {HTMLElement[]}
   */
  protected static filterVisibleElements(elements: HTMLElement[]): HTMLElement[] {
    return elements.filter(element => element.offsetWidth > 0 || element.offsetHeight > 0);
  }

  @Input() title: string;
  @Input() fullscreen: boolean;
  @Output() activeChange = new EventEmitter();

  closing: boolean;
  closed: boolean = true;

  protected previouslyFocusedElement: HTMLElement;

  constructor(protected elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.setFirstFocus();
  }

  get active(): boolean {
    return !this.closed;
  }

  @Input()
  set active(active) {
    if (active) {
      this.closed = false;
    } else if (this.previouslyFocusedElement) {
      this.closing = true;
      this.previouslyFocusedElement.focus();
      setTimeout(() => {
        this.closed = true;
        this.closing = false;
      }, 400);
    } else {
      this.closed = true;
      this.closing = false;
    }

    this.activeChange.emit(active);
  }

  close() {
    this.active = false;
  }

  @HostListener('document:keydown', ['$event'])
  documentKeydown(event: KeyboardEvent) {
    if (this.closed) { return; }

    switch (event.keyCode) {
      case 27: // esc
        this.close();
        break;
      case 9: // tab
        this.trapFocus(event);
        break;
      default: return;
    }
  }

  @HostListener('body:mouseup', ['$event'])
  bodyMouseup(event: MouseEvent) {
    if (this.closed) { return; }

    let clickedElement = event.target as HTMLElement;
    let inModal = false;

    do {
      if (clickedElement === this.elementRef.nativeElement) {
        inModal = true;
      }
      clickedElement = clickedElement.parentNode as HTMLElement;
    } while (clickedElement);

    if (!inModal) {
      this.close();
    }
  }

  protected setFirstFocus() {
    const element = this.elementRef.nativeElement;
    const autoFocusElements: HTMLElement[] = [].slice.call(element.querySelectorAll('*[autofocus]'));

    if (autoFocusElements.length > 0) {
      // Get the last defined autofocus element
      const lastAutoFocusElement = autoFocusElements[autoFocusElements.length - 1] as HTMLElement;
      this.setFocus(lastAutoFocusElement);
    }
  }

  protected trapFocus(event: KeyboardEvent) {
    const modal = this.elementRef.nativeElement;
    const tabElements = ModalComponent.getTabElements(modal);
    const firstTab = tabElements[0];
    const lastTab = tabElements[tabElements.length - 1];

    if (event.shiftKey && event.target === firstTab) {
      lastTab.focus();
      event.preventDefault();
    } else if (!event.shiftKey && event.target === lastTab) {
      firstTab.focus();
      event.preventDefault();
    }
  }

  // Angular 4's renderer no longer supports invokeElementMethod, so we need to set focus another way
  protected setFocus(element: HTMLElement) {
    setTimeout(() => element.focus(), 100);
  }
}
