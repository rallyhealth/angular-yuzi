import * as angular from 'angular';
import * as template from './examples.accordion.html';

export class AccordionExampleComponent implements ng.IComponentOptions {
  public templateUrl: string;
  public controller: any;

  constructor() {
    this.controller = AccordionExampleController;
    this.templateUrl = template;
  }
}

class AccordionExampleController implements ng.IComponentController {
  public questions: {}[];

  constructor() {
    this.questions = [{
      question: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'
    }, {
      question: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      answer: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }, {
      question: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium?',
      answer: '<span style="font-weight:bold">Nemo enim</span> ipsam voluptatem quia voluptas sit <a href="http://www.google.com" target="_blank">aspernatur</a> aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
    }];
  }
}

angular
  .module('examples.accordion', ['yuzi.accordion'])
  .component('accordionExample', new AccordionExampleComponent());
