# Grid List
A simple media grid layout for Angular Universal projects.

## Installation
```sh
npm i @flosportsinc/ng-grid-list
```

Import `FloGridListModule`:

```js
import { NgModule } from '@angular/core'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'

@NgModule({
  imports: [
    FloGridListModule
  ]
})
export class AppModule { }
```

With configured values:

```js
import { NgModule } from '@angular/core'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'

// Available options, defaults are shown.
// When configured these values become the defaults when 
// no @input property is provided for the same property 
@NgModule({
  imports: [
    FloGridListModule.config({
      selectNextEmptyOnCount: false,
      selectNextEmptyOnAdd: false
      selectFromLowerIndicesFirst: false,
      containerIdPrefix: '__fs_grid__',
      fillToFit: true,
      items: [],
      count: 4,
      max: 25,
      min: 1,
      maxHeight: 600,
      selectedIndex: 0,
      dragDrop: {
        enabled: true,
        allowedFromLists: true
      },
      overlay: {
        throttle: 30,
        static: false,
        start: true,
        ngStyle: {},
        ngClass: {},
        fadeout: 2000,
        enabled: true
      }
    })
  ]
})
export class AppModule { }
```

## Usage
```html
<!-- GRID VIEWPORT -->
<!-- Available items are defined from N number of flo-grid-list -->
<flo-grid-list-view #gridRef>
  <div *floGridListOverlay> <!-- optional: an overylay can be marked like so -->
    <button (click)="gridRef.setCount(1)">1</button> <!-- notice the use of the grid's api via #gridRef variable -->
    <button (click)="gridRef.setCount(2)">2</button>
    <button (click)="gridRef.setCount(4)">4</button>
  </div>
  <div *floGridListItemNone> <!-- when a square is shown but has no item value, use a template here -->
    Something goes here when items are EMPTY!
  </div>
  <div *floGridListItemSome="let item"> <!-- Magic -->
    Show some html or components here complete with values from the list.
    ex: {{ item.id }}
  </div>
</flo-grid-list-view>

<!-- LIST -->
<!-- [gridTileRef] is required to send the items to a grid  -->
<!-- [items] is where your data model comes in and fills the lists  -->
<flo-grid-list [gridTileRef]="gridRef" [items]="items"> <!-- Magic -->
  <div *floGridListItem="let item">
    {{ item.src }}
  </div>
</flo-grid-list>
```