# FloSports Angular Media Source Extensions
A cross platform HTML 5 Media Source Extensions interface for Angular.

Includes the two most popular formats out of the box: HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming (DASH). These two implementations are written in pure Javascript and simple wrappers around [hls.js](https://github.com/video-dev/hls.js) and [dash.js](https://github.com/Dash-Industry-Forum/dash.js/). The module will fallback to native browser support if needed (as in the case for iOS Safari).

The primary goal of this library is to allow `<video>` elements to accept a source in the required format (ex: .m3u8 files) and react to changes when `src` is changed in an angular component.

How this would look in practice:

__HLS:__
```html
<video floMse src="https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8"></video>
```
__DASH__
```html
<video floMse src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"></video>
```

## Table of Contents

- [HlsModule](/hls#hls-installation)
- [DashModule](/hls#dash-installation)
- [MseModule (for custom implementations)](/hls#advanced-installation)

## MSE Installation (required for any of the supported extensions)
Save the library as an application dependency
```bash
npm i @flosportsinc/ng-media-source-extensions
```

Import the module into your angular application
```js
import { NgModule } from '@angular/core'
import { FloMseModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [FloMseModule]
})
export class AppModule { }
```

## HLS Installation
Save the library as an application dependency
```bash
npm i @types/hls.js hls.js
```

Import the module into your angular application
```js
import { NgModule } from '@angular/core'
import { FloHlsModule, FloMseModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [
    FloMseModule,
    FloHlsModule, // without config overrides
    FloHLsModule.config({
      floConfig: {
        selfHeal: true // attempts to fix errors automatically
      },
      hlsConfig: {} // See: https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
    })
  ]
})
export class AppModule { } // If you are using Angular Universal, this MUST be in your AppBrowserModule
```

Now you are free to .m3u8 HLS files in all modern browsers.
```html
<video floMse src="https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8"></video>
```

## DASH Installation
Save the library as an application dependency
```bash
npm i dashjs
```

Import the module into your angular application
```js
import { NgModule } from '@angular/core'
import { FloDashModule, FloMseModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [
    FloMseModule,
    FloDashModule
  ]
})
export class AppModule { } // If you are using Angular Universal, this MUST be in your AppBrowserModule
```

Now you are free to .mpd files in all modern browsers.
```html
<video floMse src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"></video>
```

## Usage
The `floMse` directive emits 3 keys events `srcChange, mseClient, mseClientMessage`

- (srcChange): whenever a video elements src property changes, this event fires.
- (mseClient): when the video's MSE client (for example hls.js) loads, this event fires and send the reference to the mse client.
- (mseClientMessage): the clients usually have a way to log messages, this event forwards those message through the directive.

```html
<!-- You are able to double bind to "src" and "floMseClient" attributes or simply use (srcChange) and (floMseClientChange) -->
<video floMse 
  [(src)]="src"
  (srcChange)="sourceChanged($event)" 
  [(floMseClient)]="mseClient"
  (floMseClientChange)="mseClientChange($event)" 
  (floMseClientMessageChange)="message($event)" 
  src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd">
</video>
```

```js
import { NgModule } from '@angular/core'

@NgModule({
  imports: [
    FloMseModule,
    FloDashModule
  ]
})
export class MyComponent {

  sourceChanged(evt: string) {
    // do something with the url
  }

  mseClientChange(evt: MseClientContext<TMseClient>) {
    evt.contextKey.tapSome(console.log) // if exists, will print "hls"
    evt.mseClient.tapSome(client => {
      client.performLibraryMagic // this would be the hls.js instance with associated video already setup.
    })
  }

  message(evt: any) {
    // do something with the messages
  }
}
```

## Advanced Installation
Work in progress...