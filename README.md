# angular-yuzi
Yuzi is an open source UI library, focused around stylish usability for the web. There are plenty of UI libraries out
there, but not all of them are optimized for accessibility. The goal of yuzi is provide a slick user experience for
everyone without sacrificing visual appeal. Angular-yuzi accomplishes this goal for projects using the AngularJS framework.

## Installation
`npm install @rally/angular-yuzi --save`

## Features

### Modal
The yuzi modal is route-driven. It will add a named router outlet called "modal". 

At the top of your root component's template, add:
```html
<uz-modal></uz-modal>
```

To create a new modal route, add the following config object to your routing module:
```ts
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
