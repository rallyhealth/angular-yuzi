import * as angular from 'angular';
import { IAccordionController, IAccordionItem } from './accordion.interfaces';

export class AccordionController implements IAccordionController {
  public items: IAccordionItem[];
  public isExpandMainControl: boolean = true;

  constructor() {
    this.items = angular.copy(this.items) || [];
    console.log('accordion');
  }

  toggleItem(index: number): void {
    this.items[index].$expanded = !this.items[index].$expanded;
    this.toggleMainControlIfNeeded();
  }

  expandOrCollapseAll(): void {
    for (let item of this.items) {
      item.$expanded = this.isExpandMainControl;
    }
    this.isExpandMainControl = !this.isExpandMainControl;
  }

  private toggleMainControlIfNeeded(): void {
    for (let item of this.items) {
      if (item.$expanded !== this.isExpandMainControl) {
        return;
      }
    }
    this.isExpandMainControl = !this.isExpandMainControl;
  }
}
