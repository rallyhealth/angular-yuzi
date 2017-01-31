///<reference path='../yuzi.d.ts'/>

export class AccordionItemDirective implements ng.IDirective {
  restrict = 'A';
  require = '^accordion';
  scope = {
    item: '=accordionItem',
    animateTime: '&'
  };
  link = (scope, element, attrs, $accordion) => {
    const yPadding = parseInt(getComputedStyle(element[0]).paddingTop, 10) +
      parseInt(getComputedStyle(element[0]).paddingBottom, 10);

    element
      .css('padding-top', 0)
      .css('padding-bottom', 0);

    scope.$watch('item.$expanded', ($expanded) => {
      const animateTime = attrs.animateTime || 500;
      if ($expanded) {
        element.addClass('accordion-expanded')
          .attr('aria-hidden', false)
          .css('display', 'block')
          .css('transition', 'height ' + animateTime + 'ms, padding ' + animateTime + 'ms');
        const expandedHeight = element[0].scrollHeight + yPadding + 'px';
        element.css('height', expandedHeight);
      } else {
        element.removeClass('accordion-expanded')
          .attr('aria-hidden', true)
          .css('height', 0);
        this.$timeout(() => {
          element.css('display', 'none');
        }, animateTime);
      }
    });
  };

  public static Factory(): ng.IDirectiveFactory {
    const directive: ng.IDirectiveFactory = ($timeout: ng.ITimeoutService) => new AccordionItemDirective($timeout);
    directive.$inject = ['$timeout'];
    return directive;
  }

  constructor(private $timeout: ng.ITimeoutService) {}
}
