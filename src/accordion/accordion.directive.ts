///<reference path='../yuzi.d.ts'/>

import * as angular from 'angular';
import 'angular-translate';
import { AccordionController } from './accordion.controller';
import * as accordionTemplate from './accordion.html';
import { AccordionItemDirective } from './accordion-item.directive';
import './accordion.styl';

export class AccordionDirective implements ng.IDirective {
  restrict = 'E';
  replace = true;
  scope = {};
  templateUrl = accordionTemplate;
  controller = AccordionController;
  controllerAs = '$accordion';
  bindToController = {
    items: '<',
    label: '@',
    value: '@',
    interpolations: '@?'
  };

  public static Factory(): ng.IDirectiveFactory {
    return () => new AccordionDirective();
  }
}

angular.module('yuzi.accordion', ['pascalprecht.translate'])
  .directive('accordion', AccordionDirective.Factory())
  .directive('accordionItem', AccordionItemDirective.Factory());
