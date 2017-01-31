export interface IDropdownOption {
  label: string;
  value: string;
  target?: string;
}

export interface IDropdownBindings {
  options: IDropdownOption[];
  nav?: boolean;
  onSelect?: Function;
  selected?: IDropdownOption;
  optionsClass?: string;
  optionClass?: string;
  toggleClass?: string;
  label?: string;
}

export interface IDropdownController extends IDropdownBindings {
  selectOption(option: IDropdownOption): void;
  selectedIndex: number;
  show: boolean;
  toggle(): void;
  optionsId: string;
  toggleId: string;
}

export interface IDropdownService {
  currentOption: number;
  nextOption(): void;
  prevOption(): void;
  openDropdown(): void;
  closeDropdown(): void;
  setSelectedIndex(index: any): void;
}
