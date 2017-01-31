export interface IAccordionItem {
  $expanded?: boolean;
}

export interface IAccordionController {
  items: IAccordionItem[];
  isExpandMainControl: boolean;
  toggleItem(index: number): void;
  expandOrCollapseAll(): void;
}
