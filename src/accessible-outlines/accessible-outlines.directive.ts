///<reference path='../yuzi.d.ts'/>

import * as angular from 'angular';

export class AccessibleOutlinesDirective implements ng.IDirective {
  restrict = 'A';
  template = '';
  link = ($scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {
    const cssClass = attrs['hideOutlinesClass'] || 'yuzi-hide-outlines';
    const css = `.${cssClass} *, .${cssClass} *:focus { outline: 0!important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';

    if (style['styleSheet']) {
      style['styleSheet'].cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    element
      .addClass(cssClass)
      .on('mousedown', function() {
        element.addClass(cssClass);
      })
      .on('keydown', function(e) {
        // When tab is pressed, allow for outlines
        if (e.keyCode === 9) {
          element.removeClass(cssClass);
        }
      });
  };

  public static Factory(): ng.IDirectiveFactory {
    var directive: ng.IDirectiveFactory = () => new AccessibleOutlinesDirective();
    return directive;
  }
}

angular.module('yuzi.outlines', [])
  .directive('accessibleOutlines', AccessibleOutlinesDirective.Factory());
