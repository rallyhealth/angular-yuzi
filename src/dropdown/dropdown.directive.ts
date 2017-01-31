///<reference path='../yuzi.d.ts'/>

import * as angular from 'angular';
import * as jQuery from 'jquery';
import { DropdownController } from './dropdown.controller';
import { IDropdownController } from './dropdown.interfaces';
import { DropdownService } from './dropdown.service';
import * as dropdownTemplateUrl from './dropdown.html';
import * as dropdownNavTemplateUrl from './dropdown-nav.html';
import './dropdown.styl';

export class DropdownDirective implements ng.IDirective {
  restrict = 'E';
  templateUrl = function(element, attrs) {
    if (attrs.nav !== undefined && attrs.templateUrl === undefined) {
      return dropdownNavTemplateUrl;
    } else {
      return dropdownTemplateUrl;
    }
  };
  scope = {};
  controller = DropdownController;
  controllerAs = '$dropdown';
  bindToController = {
    options: '<',
    nav: '<?',
    onSelect: '&?',
    selected: '<?',
    optionsClass: '@?',
    optionClass: '@?',
    toggleClass: '@?',
    label: '@?'
  };

  link = ($scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, $dropdown: IDropdownController) => {
    let uniqueId;
    let toggle;
    let options;
    let dropdownService: DropdownService;

    const setupEventListeners = () => {
      toggle = element[0].getElementsByClassName($dropdown.toggleClass)[0];
      options = element[0].getElementsByClassName($dropdown.optionClass);
      dropdownService = new DropdownService($scope, $dropdown, options, toggle);

      uniqueId = this.uniqueId ++;
      $dropdown.optionsId = $dropdown.optionsClass.split(' ').join('') + '-' + uniqueId;
      $dropdown.toggleId = $dropdown.toggleClass.split(' ').join('') + '-' + uniqueId;

      element.on('keydown', function(e) {
        switch (e.keyCode) {
          case 40:
            dropdownService.nextOption();
            e.preventDefault();
            break;
          case 38:
            dropdownService.prevOption();
            e.preventDefault();
            break;
          case 13:
          case 32:
            if (!$dropdown.nav) {
              angular.element(e.target).triggerHandler('click');
              toggle.focus();
              e.preventDefault();
            }
            break;
          case 27:
            dropdownService.closeDropdown();
            toggle.focus();
            break;
        }
      });

      const closeIfFocusLeavesDropdown = (event) => {
        if (jQuery(element).has(event.relatedTarget).length === 0) {
          dropdownService.closeDropdown();
        }
      };

      /**
       * For the general case, use focusout instead of blur since blur supports bubbling. This way a single
       * event handler can be registered on the dropdown button. Also note that in IE11 blur events don't have
       * relatedTarget, so focusout must be used for IE.
       * Firefox doesn't support the focusout event so for FF, instead register blur event handlers on the
       * dropdown button and all of its children.
       */
      if (/firefox/i.test(navigator.userAgent)) {
        element.find('*').on('blur', function(e) {
          closeIfFocusLeavesDropdown(e);
        });
      } else {
        element.on('focusout', function(e) {
          closeIfFocusLeavesDropdown(e);
        });
      }

      /**
       * Safari doesn't set focus to the toggle element on click by default, which in turn prevents the focusout
       * event from firing. To fix it, we're forcing focus when the user clicks the toggle button. Note: focus
       * is set properly on keyboard navigation.
       */
      if (/safari/i.test(navigator.userAgent)) {
        angular.element(toggle).on('click', () => {
          toggle.focus();
        });
      }

      $scope.$watch('$dropdown.selected', function(val) {
        dropdownService.setSelectedIndex(val);
      });

      $scope.$watch(() => element.attr('label'), val => {
        if (val !== undefined) {
          $dropdown.label = val;
        }
      });
    };

    this.$timeout(setupEventListeners, 0);
  };

  public uniqueId = -1;
  public static Factory(): ng.IDirectiveFactory {
    const directive: ng.IDirectiveFactory =
      ($timeout: ng.ITimeoutService) =>
        new DropdownDirective($timeout);
    directive.$inject = ['$timeout'];
    return directive;
  }

  constructor(private $timeout: ng.ITimeoutService) {}
}

angular.module('yuzi.dropdown', [])
  .directive('dropdown', DropdownDirective.Factory());
