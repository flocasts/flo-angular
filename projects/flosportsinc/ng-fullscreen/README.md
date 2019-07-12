# Fullscreen

## Installation
```sh
npm i @flosportsinc/ng-fullscreen
```

Import `FloFullscreenModule`:

```js
import { NgModule } from '@angular/core'
import { FloFullscreenModule } from '@flosportsinc/ng-fullscreen'

@NgModule({
  imports: [
    FloFullscreenModule
  ]
})
export class AppModule { }
```

## Usage
`floClickToExitFullscreen` will listen for click events on a given element and leave fullscreen.
`floClickToEnterFullscreen` will listen for click events on a given element and enter fullscreen on the document body or a provided reference to another html element.
`*floIfFullscreen` renders its element if the document is in fullscreen
`*floIfNotFullscreen` renders its element if the document is _NOT_ in fullscreen

```html
<div #takeMeFullscreen>
  <h3>I am content you can see when fullscreen</h3>
  <button *floIfFullscreen floClickToExitFullscreen>Exit Fullscreen</button>
  <button *floIfNotFullscreen [floClickToEnterFullscreen]="takeMeFullscreen">Enter Fullscreen</button>
</div>
```