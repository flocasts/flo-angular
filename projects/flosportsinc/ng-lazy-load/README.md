# ng-lazy-load
*ng-lazy-load* is an Angular directive to load elements lazily. 

It uses [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to check if an element is in viewport and falls back to scroll detection mechanism for unsupported browsers.

[Original Repo](https://github.com/TradeMe/ng-defer-load)

## Installation

Using npm:
```shell
$ npm i @flosportsinc/ng-lazy-load
```
## Usage

1. Import `FloLazyLoadModule` into the module corresponding to your component

2. Use the directive with the element you wish to lazy load
```html
  <div
    (floLazyLoad)="showMyElement=true">
    <my-element
       *ngIf=showMyElement>
      ...
    </my-element>
</div>
```
*Note:* You might want to have a loading state for your element with approximately same height as the element.

## Server Side Rendering

`ng-lazy-load` supports Server Side Rendering from version 1.1.0

It loads the element on the server by default supporting Search Engine Optimization. If you do not want to pre-render the element in server, you can set `preRender` to false on the element as below:

```html
  <div
    [preRender]="false"
    (floLazyLoad)="showMyElement=true">
    <my-element
       *ngIf=showMyElement>
      ...
    </my-element>
</div>
```

## Fall back support

`ng-lazy-load` supports a fall back in browsers that do not support the IntersectionObserver API. This uses the scroll position and the element's offset. This is enabled by default.

If you do not want to allow this fallback, and would prefer the browser to just render the element regardless, you can set `fallbackEnabled` to false on the element as below:

```html
  <div
    [fallbackEnabled]="false"
    (floLazyLoad)="showMyElement=true">
    <my-element
       *ngIf=showMyElement>
      ...
    </my-element>
</div>
```

## Demo

Demo of *ng-lazy-load* in use is available [here](https://stackblitz.com/edit/angular-defer-load).

## License

Released under the [MIT license](https://github.com/TradeMe/ng-lazy-load/blob/master/README.md).

## Release notes

v1.0.1 - Initial version

v1.1.0 - Supports Universal - Server Side Rendering

v2.0.0 - Supports Angular 6

v3.0.0 - Supports Angular 7

v3.1.0 - Made it possible to switch off scroll fallback
