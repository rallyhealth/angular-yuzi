import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'uz-modal',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal.component.html'
})

export class ModalComponent implements OnInit {
  title: string;
  closing: boolean;
  fullscreen: boolean;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // Monitor when the modal secondary outlet is loaded
    this.router.events
      .filter(event => event instanceof RoutesRecognized)
      .flatMap((event: RoutesRecognized) => event.state.root.children)
      .do((snapshot: ActivatedRouteSnapshot) => this.closing = snapshot.outlet !== 'modal')
      .filter(snapshot => snapshot.outlet === 'modal' && snapshot.data['modal'] && snapshot.data['modal'])
      .do(snapshot => this.title = snapshot.data['modal']['title'])
      .do(snapshot => this.fullscreen = snapshot.data['modal']['fullscreen'])
      .subscribe();
  }

  close() {
    this.closing = true;
    return this.router.navigate([{ outlets: { modal: null } }]);
  }
}
