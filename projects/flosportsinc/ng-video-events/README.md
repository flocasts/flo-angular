# FloVideoEvents
Use Dependency Injection to bind to arbitrary video player events for easy extensibility

## NPM Installation
```sh
npm i @flosportsinc/ng-video-events
```

## App
Inside your `AppModule` install `SvgTransferStateModule` like so:

```js
import { NgModule } from '@angular/core'
import { FloVideoEventsModule, VIDEO_PLAYER_EVENT_BINDINGS } from '@flosportsinc/ng-video-events'

@NgModule({
  imports: [
    FloVideoEventsModule
  ],
  providers: [
    // define your event bindings via Angular dependency injection
    {
      provide: VIDEO_PLAYER_EVENT_BINDINGS,
      multi: true,
      useValue: {
        // every event has the following signature
        pause: (videoEvent: Event, videoElement: HTMLVideoElement, 
          videoInstanceId: string,  videoGroupId: string, 
          metadata: TMeta, emitFunc: (msg: TMessage) => void, 
          onDestroy: Observable<any>) => {
            // do stuff in here
        }
      }
    },
    {
      provide: VIDEO_PLAYER_EVENT_BINDINGS,
      multi: true,
      useFactory: (someService) => { // for AOT, you will need to make this an exported factory function
        return {
          pause: (...args) => {
            // do stuff here
            someService.doTheThing(arg[1])
          }
        }
      },
      deps: [SomeService] // pass in your services to do more interesting things!
    }
  ]
})
export class AppModule { }
```

Event handler signature
```js
type FloVideoEventHandler<TMeta = any, TMessage = any> = (
  videoEvent: Event,
  videoElement: HTMLVideoElement,
  videoInstanceId: string,
  videoGroupId: string,
  metadata: TMeta,
  emitFunc: (msg: TMessage) => void,
  onDestroy: Observable<any>
) => void
```

## Basic usage
Any event mappings providers will be bound and executed accoridingly during the `video` player lifecycle.

```html
<video floVideoEvents></video>
```

## With metadata
You can pass data from parent components through to your event binding functions if needed. 

```js
  // notice the "metadata" parameter
  (videoEvent: Event, videoElement: HTMLVideoElement, 
    videoInstanceId: string,  videoGroupId: string, 
    metadata: TMeta, emitFunc: (msg: TMessage) => void, 
    onDestroy: Observable<any>) => {
      // you can use it in your event binding
    }
```

```html
<video [floVideoEvents]="{ property: 'some', property2: 'info' }"></video>
```

## Emit changes from event bindings
You can emit messages from your event bindings and pass them back up to parent components if needed. 

```js
  // notice the "emitFunc" parameter
  (videoEvent: Event, videoElement: HTMLVideoElement, 
    videoInstanceId: string,  videoGroupId: string, 
    metadata: TMeta, emitFunc: (msg: TMessage) => void, 
    onDestroy: Observable<any>) => {
      // calling this will emit an event from the directive "floVideoEventMessage"
      emitFunc('whatever you want')
    }
```

```html
<video floVideoEvents [floVideoEventMessage]="captureMessages($event)"></video>
```


