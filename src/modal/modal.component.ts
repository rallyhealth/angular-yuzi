import { AfterViewChecked, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import { ModalService, ModalStatus } from './modal.service';

@Component({
  selector: 'uz-modal',
  exportAs: 'uzModal',
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
  private route: ActivatedRouteSnapshot;

  constructor(
    private elementRef: ElementRef,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit() {
    // Monitor when the modal secondary outlet is loaded
    this.router.events
      .filter(event => event instanceof RoutesRecognized)
      .flatMap((event: RoutesRecognized) => event.state.root.children)
      .do((snapshot: ActivatedRouteSnapshot) => this.closed = snapshot.outlet !== 'modal')
      .filter(snapshot => snapshot.outlet === 'modal')
      .do(snapshot => {
        const hasRouteData = (prop: string) =>
        snapshot.data && snapshot.data.modal && typeof snapshot.data.modal[prop] !== 'undefined';

        this.newModalDetected = true;
        this.title = hasRouteData('title') ? snapshot.data.modal.title : undefined;
        this.fullscreen = hasRouteData('fullscreen') ? snapshot.data.modal.fullscreen : false;
        this.route = snapshot;
      })
      .subscribe();

    this.modalService.statusChange.subscribe(status => {
      if (status === ModalStatus.Closed) {
        this.close();
      }
    });
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
      this.router.navigate([{ outlets: { modal: null } }], { queryParams: this.route.queryParams })
        .then(() => {
          this.closed = true;
          this.closing = false;
        });
    }, 400);
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

  private setFirstFocus() {
    const element = this.elementRef.nativeElement;
    const autoFocusElements: HTMLElement[] = [].slice.call(element.querySelectorAll('*[autofocus]'));

    if (autoFocusElements.length > 0) {
      // Get the last defined autofocus element
      const lastAutoFocusElement = autoFocusElements[autoFocusElements.length - 1] as HTMLElement;
      this.setFocus(lastAutoFocusElement);
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

  // Angular 4's renderer no longer supports invokeElementMethod, so we need to set focus another way
  private setFocus(element: HTMLElement) {
    setTimeout(() => element.focus(), 100);
  }
}
