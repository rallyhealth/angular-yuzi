import { IDropdownController, IDropdownService } from './dropdown.interfaces';

export class DropdownService implements IDropdownService {
  public currentOption: number;

  constructor(
    private $scope: ng.IScope,
    private $ctrl: IDropdownController,
    private options: NodeListOf<Element>,
    private toggle: HTMLElement
  ) {
    this.currentOption = -1;
  }

  resetCurrentOption(): number {
    let i = this.options.length;
    const currentFocus = document.activeElement;
    while (i > -1) {
      if (this.options[i] === currentFocus) {
        break;
      }
      i --;
    }
    return i;
  }

  nextOption():void {
    let target;
    this.currentOption = this.resetCurrentOption();
    this.currentOption ++;
    this.currentOption = (this.currentOption > this.options.length - 1)
      ? this.options.length - 1
      : this.currentOption;
    target = <HTMLElement>this.options[this.currentOption];

    if (this.currentOption === 0) {
      this.openDropdown();
    }

    target.focus();
  }

  prevOption(): void {
    let target;
    this.currentOption = this.resetCurrentOption();

    if (this.currentOption === -1) {
      this.closeDropdown();
    }

    this.currentOption --;
    this.currentOption = (this.currentOption < 0) ? -1 : this.currentOption;
    target = (this.currentOption === -1)
      ? <HTMLElement>this.toggle
      : <HTMLElement>this.options[this.currentOption];
    target.focus();
  }

  openDropdown(): void {
    this.$ctrl.show = true;
    this.$scope.$apply();
  }

  closeDropdown(): void {
    this.$ctrl.show = false;
    this.$scope.$apply();
  }

  setSelectedIndex(item): void {
    let options = this.$ctrl.options;
    let index = options.indexOf(item);

    // If we get a string, assume we're looking for a value and search through our option objects
    if (typeof item === 'string') {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === item) {
          index = i;
        }
      }
    }

    if (index > -1) {
      this.$ctrl.selectedIndex = index;
    }
  }
}
