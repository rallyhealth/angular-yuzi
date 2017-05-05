import { AfterViewChecked, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'uz-modal',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal.component.html'
})

export class ModalComponent implements OnInit, AfterViewChecked {

  /**
   * Gets all tab-able elements from within an HTML node
   * @param parent - topmost node to search within
   * @returns {HTMLElement[]}
   */
  private static getTabElements(parent?: HTMLElement): HTMLElement[] {
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
  private static filterVisibleElements(elements: HTMLElement[]): HTMLElement[] {
    return elements.filter(element => element.offsetWidth > 0 || element.offsetHeight > 0);
  }

  title: string;
  closing: boolean;
  closed: boolean = true;
  fullscreen: boolean;

  private newModalDetected: boolean;
  private previouslyFocusedElement: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit() {
    // Monitor when the modal secondary outlet is loaded
    this.router.events
      .filter(event => event instanceof RoutesRecognized)
      .flatMap((event: RoutesRecognized) => event.state.root.children)
      .do((snapshot: ActivatedRouteSnapshot) => this.closed = snapshot.outlet !== 'modal')
      .filter(snapshot => snapshot.outlet === 'modal' && snapshot.data['modal'] && snapshot.data['modal'])
      .do(snapshot => this.newModalDetected = true)
      .do(snapshot => this.title = snapshot.data['modal']['title'])
      .do(snapshot => this.fullscreen = snapshot.data['modal']['fullscreen'])
      .subscribe();
  }

  ngAfterViewChecked() {
    if (this.newModalDetected) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement;
      this.setFirstFocus();
      this.newModalDetected = false;
    }
  }

  close() {
    this.closing = true;
    this.previouslyFocusedElement.focus();
    setTimeout(() => {
      this.router.navigate([{ outlets: { modal: null } }]);
      this.closed = true;
      this.closing = false;
    }, 400);
  }

  setFirstFocus() {
    const element = this.elementRef.nativeElement;
    const autoFocusElements: HTMLElement[] = [].slice.call(element.querySelectorAll('*[autofocus]'));

    if (autoFocusElements.length > 0) {
      // Get the last defined autofocus element
      const lastAutoFocusElement = autoFocusElements[autoFocusElements.length - 1] as HTMLElement;
      lastAutoFocusElement.focus();

      if (document.activeElement === lastAutoFocusElement) {
        return;
      }
    }

    const tabElements = ModalComponent.getTabElements(element);
    if (tabElements.length > 0) {
      tabElements[0].focus();
    }
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

  private trapFocus(event: KeyboardEvent) {
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
}
