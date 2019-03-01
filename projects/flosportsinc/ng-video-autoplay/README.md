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


## Usage
`floVideoAutoplay` expects an element reference. The directive will automatically bind to its click events and show and hide the element if the video is muted.
This minimal approach allows for full customization. In future version there will likley be classes that are applied instead the current on/off approach in order to support animations

```html

<div>
  <button #unmute>Click to unmute</button>
  <video [floVideoAutoplay]="unmute" src="http://techslides.com/demos/sample-videos/small.mp4" width="600" playsinline></video>
</div>
```