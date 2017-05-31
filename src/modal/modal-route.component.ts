import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';

import { ModalComponent } from './modal.component';
import { ModalService, ModalStatus } from './modal.service';

@Component({
  selector: 'uz-modal-route',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal-route.component.html'
})

export class ModalRouteComponent extends ModalComponent implements OnInit, AfterViewChecked {

  private newModalDetected: boolean;
  private route: ActivatedRouteSnapshot;

  constructor(
    protected elementRef: ElementRef,
    private modalService: ModalService,
    private router: Router
  ) {
    super(elementRef);
  }

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

  ngAfterViewInit() {}

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
}
