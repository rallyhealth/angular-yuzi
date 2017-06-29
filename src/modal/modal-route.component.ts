import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { ModalComponent } from './modal.component';
import { ModalService, ModalStatus } from './modal.service';

export interface ModalRoute extends Component {
  uzModalTitle: string;
  uzModalFullscreen: boolean;
}

@Component({
  selector: 'uz-modal-route',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal-route.component.html'
})

export class ModalRouteComponent extends ModalComponent implements OnInit {
  private static hasPreviousRoute(prev?: NavigationEnd): boolean {
    // Short-circuit this block if someone opens this link in a new tab from a link
    if (window.history.length <= 1) {
      return false;
    }

    const refreshed = window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD;
    const localReferrer = !!document.referrer && document.referrer.indexOf(window.location.hostname) > -1;

    return (prev && typeof prev.url !== 'undefined' && prev.url.indexOf('(modal:') === -1) || // from a previous non-modal route
      (!document.referrer && refreshed) || // user refreshes on a modal route
      localReferrer; // user navigates to a modal route from somewhere else on the same domain
  }

  private hasPreviousRoute = false;
  private route: ActivatedRouteSnapshot;

  constructor(
    protected elementRef: ElementRef,
    private modalService: ModalService,
    private router: Router
  ) {
    super(elementRef);
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .do(() => this.hasPreviousRoute = ModalRouteComponent.hasPreviousRoute())
      .pairwise()
      .do(([prev, next]) => {
        this.hasPreviousRoute = ModalRouteComponent.hasPreviousRoute(prev as NavigationEnd);
      })
      .subscribe();

    this.modalService.statusChange.subscribe(status => {
      if (status === ModalStatus.Closed) {
        this.close();
      }
    });
  }

  activated(component: ModalRoute) {
    this.closed = false;
    this.title = component.uzModalTitle;
    this.fullscreen = component.uzModalFullscreen || false;
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.setFirstFocus();
  }

  deactivated(component: ModalRoute) {
    this.closed = true;
    this.closing = false;
  }

  close() {
    this.closing = true;
    this.previouslyFocusedElement.focus();
    setTimeout(() => {
      if (this.hasPreviousRoute) {
        window.history.back();
      } else {
        this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'merge', replaceUrl: true });
      }
    }, 400);
  }
}
