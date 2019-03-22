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

## Single video _without_ clickable reference
The video will always play, but start muted if the browser has yet to build trust with the domain.

```html
<video floVideoAutoplay src="http://techslides.com/demos/sample-videos/small.mp4"></video>

<!- You can also disable it when needed ->
<video [floVideoAutoplay]="false" src="http://techslides.com/demos/sample-videos/small.mp4"></video>
```

## Single video _with_ clickable references
`floVideoAutoplay` can use an element reference. It automatically bind to its click events and show and hide the element if the video is muted.
This minimal approach allows for full customization. In future version there will likley be classes that are applied instead the current on/off approach in order to support animations.

```html
<div>
  <button #unmute>Click to unmute</button>
  <button #play>Click to play</button>
  <video floVideoAutoplay
    [floVideoAutoplayClickUnmuteRef]="unmute"
    [floVideoAutoplayClickPlayRef]="play"
    src="http://techslides.com/demos/sample-videos/small.mp4">
  </video>
</div>
```

## Multi video _without_ clickable reference
Autoplay all child videos.

```html
<div floVideoAutoplay>
  <video #floVideoAutoplay src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" width="300" playsinline controls></video>
  <video #floVideoAutoplay src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" width="300" playsinline controls></video>
</div> 
```

## Multi video _with_ clickable reference
Autoplay all child videos. References a clickable element to unmute when videos are started muted. The click event will only affect a single video in this case (instead of unmuting them all)

```html
<div floVideoAutoplay [floVideoAutoplayClickUnmuteRef]="unmute" [floVideoAutoplayClickPlayRef]="play">
  <button #unmute>Click to unmute</button>
  <button #play>Click to play</button>
  <video #floVideoAutoplay src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" width="300" playsinline controls></video>
  <video #floVideoAutoplay src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" width="300" playsinline controls></video>
</div> 
```
