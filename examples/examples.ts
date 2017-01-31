import * as angular from 'angular';
import './accordion/examples.accordion';
import './dropdown/examples.dropdown';
import './examples.styl';
import '../src/accessible-outlines/accessible-outlines.directive';

class ExampleDirective implements ng.IDirective {
  restrict = 'E';
  transclude = true;
  template = `<div class="example-container"><div ng-transclude class="example-visual"></div><div class="example-code"></div></div>`;
  link = ($scope, element: ng.IAugmentedJQuery, attrs) => {
    const content = document.createTextNode(element[0].getElementsByClassName('example-visual')[0].innerHTML.trim());
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    pre.appendChild(code);
    code.appendChild(content);
    element[0].getElementsByClassName('example-code')[0].appendChild(pre);
  };

  public static Factory(): ng.IDirectiveFactory {
    return () => new ExampleDirective();
  }
}

angular
  .module('examples', ['examples.dropdown', 'examples.accordion', 'yuzi.outlines'])
  .directive('example', ExampleDirective.Factory());
