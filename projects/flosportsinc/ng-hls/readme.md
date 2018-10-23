# FloSports Angular HLS Module
Cross platform HTTP Live Streaming (HLS) in Angular

## Installation (for hls.js based module)
Save the library as an application dependency (this will also install the peer dependency hls.js)
```sh
npm i @flosportsinc/ng-hls
```

Import the module into your angular application
```js
import { NgModule } from '@angular/core'
import { HlsJsModule } from '@flosportsinc/ng-hls'

@NgModule({
  imports: [HlsJsModule]
})
export class AppModule { }
```

Now you are free to .m3u8 HLS files in all modern browsers.
```html
<video floHls="https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8"></video>
```

## Advanced Installation
WIP