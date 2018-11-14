# Angular Media Source Extensions
A cross platform HTML 5 [Media Source Extensions](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) interface for Angular. Includes the two most popular formats out of the box: HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming (DASH). These two implementations are written in pure Javascript and simple wrappers around [hls.js](https://github.com/video-dev/hls.js) and [dash.js](https://github.com/Dash-Industry-Forum/dash.js/). The module will fallback to native browser support if needed (as in the case for iOS Safari).

The primary goal of this library is to allow `<video>` elements to accept a source in the required format (ex: .m3u8 files) and react to changes when `src` is changed in an angular component.

How this would look in practice:

__HLS:__
```html
<video floHls="https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8"></video>
```
__DASH__
```html
<video floDash="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"></video>
```

## Table of Contents

- [HlsModule](/hls#hls-installation)
- [DashModule](/hls#dash-installation)
- [MseModule (for custom implementations)](/hls#advanced-installation)

## HLS Installation
Save the library as an application dependency
```bash
npm i @flosportsinc/ng-media-source-extensions
```

Import the module into your angular application
```js
import { NgModule } from '@angular/core'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [HlsModule]
})
export class AppModule { }
```

Now you are free to .m3u8 HLS files in all modern browsers.
```html
<video floHls="https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8"></video>
```

## DASH Installation
Save the library as an application dependency
```bash
npm i @flosportsinc/ng-media-source-extensions
```

Import the module into your angular application
```js
import { NgModule } from '@angular/core'
import { DashModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [DashModule]
})
export class AppModule { }
```

Now you are free to .mpd files in all modern browsers.
```html
<video floHls="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"></video>
```


## Advanced Installation
Work in progress...