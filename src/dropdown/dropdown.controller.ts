import { IDropdownController, IDropdownOption } from './dropdown.interfaces';

export class DropdownController implements IDropdownController {
  public options: IDropdownOption[];
  public nav: boolean;
  public onSelect: Function;
  public selected: IDropdownOption;
  public selectedIndex: number;
  public show: boolean;
  public optionsClass: string;
  public optionClass: string;
  public toggleClass: string;
  public optionsId: string;
  public toggleId: string;

  constructor() {
    this.nav = this.nav || false;
    this.show = this.show || false;
    this.options = this.options || [];
    this.selectedIndex = this.selectedIndex || 0;
    this.optionsClass = this.optionsClass || 'dropdown-options';
    this.optionClass = this.optionClass || 'dropdown-option';
    this.toggleClass = this.toggleClass || 'dropdown-toggle';
  }

  selectOption(option: IDropdownOption): void {
    this.selectedIndex = this.options.indexOf(option);
    this.toggle();
    this.onSelect()(option);
  }

  toggle(): void {
    this.show = !this.show;
  }
}
