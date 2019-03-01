# FloVideoAutoplay
Simple way to ensure videos autoplay even if they need to be muted first.

## Installation
```sh
npm i @flosportsinc/ng-video-autoplay
```

```js
import { FloVideoAutoplayModule } from '@flosportsinc/ng-video-autoplay'

@NgModule({
  imports: [
    ...
    FloVideoAutoplayModule,
    ...
  ]
})
export class AppModule { }
```

## Usage _without_ Element Click Reference
The video will always play, but start muted if the browser has yet to build trust with the domain.

```html
<video floVideoAutoplay src="http://techslides.com/demos/sample-videos/small.mp4"></video>
```


## Usage _with_ Element Click Reference
`floVideoAutoplay` can use an element reference. It automatically bind to its click events and show and hide the element if the video is muted.
This minimal approach allows for full customization. In future version there will likley be classes that are applied instead the current on/off approach in order to support animations

```html
<div>
  <button #unmute>Click to unmute</button>
  <video [floVideoAutoplay]="unmute" src="http://techslides.com/demos/sample-videos/small.mp4"></video>
</div>
```