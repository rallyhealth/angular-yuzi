# angular-yuzi
Yuzi is an open source UI library, focused around stylish usability for the web. There are plenty of UI libraries out
there, but not all of them are optimized for accessibility. The goal of yuzi is provide a slick user experience for
everyone without sacrificing visual appeal. Angular-yuzi accomplishes this goal for projects using the Angular framework.

## Installation
`npm install @rally/angular-yuzi --save`

## Features

### Modal Route
The yuzi modal is route-driven. It will add a named router outlet called "modal". 

At the top of your root component's template, add:
```html
<uz-modal-route></uz-modal-route>
```

To create a new modal route, add the following config object to your routing module:
```typescript
{
  path: 'foobar',
  component: FoobarComponent,
  outlet: 'modal', // the modal component implements this outlet
  data: { // optional
    modal: {
      title: 'Some fancy title'
      fullscreen: false
    }
  }
}
```

To link to this route from your template:
```html
<a [routerLink]="['', { outlets: { modal: ['foobar'] } }]">Click me for modalz</a>
```

To avoid having the location bar update when opening a modal, while preserving direct modal routing:
```html
<a [routerLink]="['', { outlets: { modal: ['foobar'] } }]" skipLocationChange>Click me for modalz</a>
```

To close the modal remotely, import the `ModalService` and create a method your template can call:
```typescript
import { ModalService } from '@rally/angular-yuzi';
...
constructor(private modalService: ModalService) {}

close() {
  this.modalService.close();
}
```

### Modal
`uz-modal-route` extends `uz-modal`, and you can use either. Most of the time, you'll probably prefer using the route 
version, but there might be a situation that prevents you from being able to. Take this snippet below as an example:
```html
<uz-modal *ngIf="isMobile; else notMobile" [fullscreen]="true" [active]="active" title="Awesome Modal Title">
  <ng-container *ngTemplateOutlet="notMobile"></ng-container>
</uz-modal>

<ng-template #notMobile>
  <ng-content></ng-content>
</ng-template>
```

The above example is missing a few implementation pieces, like the `isMobile` and `active` flags that would be defined 
in your component. This example conditionally wraps the ngContent projection with uzModal, based on the truthy value of 
`isMobile`. Again, typically, you'll use `uz-modal-route`, but this is one example of an exception. Use with caution.

### Select
The yuzi select box is keyboard navigable and the syntax should be somewhat familiar to the ordinary select box.

```html
<uz-select (change)="selectChanged($event)">
  <uz-option [value]="'superman'" [label]="'Superman'">Superman</uz-option>
  <uz-option [value]="'batman'" [label]="'Batman'">Batman</uz-option>
  <uz-option [value]="'flash'" [label]="'Flash'" selected>Flash</uz-option>
  <uz-option [value]="'wonder-woman'" [label]="'Wonder Woman'">Wonder Woman</uz-option>
  <uz-option [value]="'green-arrow'" [label]="'Green Arrow'">Green Arrow</uz-option>
</uz-select>
```

The change event emitter allows you to capture changes made to the selected option
.
```typescript
selectChanged(value: any) {
  // do something with captured value.
}
```

### Checkbox
The yuzi checkbox is simple and familiar. Utilize `ngModel` if you wish to bind to the single checkbox boolean value.
```html
<uz-checkbox name="foo" [value]="'bar'" [(ngModel)]="foo">Foo</uz-checkbox>
```

### Radio
The yuzi radio is similar to the checkbox, but `ngModel` (like for regular radios) binds to the selected value  
of the radio "name". 
```html
<uz-radio name="foo"
          value="1"
          [(ngModel)]="foo"
          i18n>Foo 1</uz-radio>
<uz-radio name="foo"
          value="2"
          [(ngModel)]="foo"
          i18n>Foo 2</uz-radio>
```
Ids for both radios and checkboxes are automatically assigned based on the name and instance number. Do not assign 
your own id.

With checkboxes, you have the option of passing in an icon class to be used for a checked option. To define the class, 
import the `IconsService` and set the `check` icon.
```typescript
import { IconsService } from '@rally/angular-yuzi';
...
constructor(private icons: IconsService) {
  icons.check = 'icon-check';
}
```
The class you choose will be responsible for rendering the icon. Sizing should be handled by the component, but you can 
always override styling in your own global stylesheet.
