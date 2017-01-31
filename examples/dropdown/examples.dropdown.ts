import * as angular from 'angular';
import * as template from './examples.dropdown.html';
import { IDropdownOption } from '../../src/dropdown/dropdown.interfaces';

export class DropdownExampleComponent implements ng.IComponentOptions {
  public templateUrl: string;
  public controller: any;

  constructor() {
    this.controller = DropdownExampleController;
    this.templateUrl = template;
  }
}

class DropdownExampleController implements ng.IComponentController {
  public locales: IDropdownOption[];
  public navItems: IDropdownOption[];
  public currentLocale: IDropdownOption;

  constructor() {
    this.locales = [{
      label: 'English',
      value: 'en'
    }, {
      label: 'Español',
      value: 'es'
    }, {
      label: '中文',
      value: 'zh'
    }];
    this.navItems = [{
      label: 'Yahoo',
      value: 'http://www.yahoo.com',
      target: '_blank'
    }, {
      label: 'Google',
      value: 'http://www.google.com',
      target: '_blank'
    }, {
      label: 'Bing',
      value: 'http://www.bing.com',
      target: '_blank'
    }];
    this.currentLocale = this.locales[0];
  }

  setLocale(): Function {
    return (option: IDropdownOption) => {
      console.log('set locale to: ', option);
    }
  }
}

angular
  .module('examples.dropdown', [
    'yuzi.dropdown'
  ])
  .component('dropdownExample', new DropdownExampleComponent());
