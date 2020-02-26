<h1 align="center" style="border-bottom: none;">FloSports Angular</h1>
<h3 align="center">A collection of Angular components for live video streaming.</h3>
<p align="center"> 
  <a href="https://circleci.com/gh/flocasts/flo-angular">
    <img alt="build" src="https://circleci.com/gh/flocasts/flo-angular.svg?style=shield&circle-token=254d41274907bc2b5e4d13d066d9d7e5e6aaf323">
  <a href="https://codeclimate.com/repos/5bd607992cf6f7026e00273b/test_coverage">
    <img alt="test coverage" src="https://api.codeclimate.com/v1/badges/11396ac422c213d7b44e/test_coverage" />
  </a>
  <a href="https://codeclimate.com/repos/5bd607992cf6f7026e00273b/maintainability">
    <img alt="maintainability" src="https://api.codeclimate.com/v1/badges/11396ac422c213d7b44e/maintainability" />
  </a>
</p>
<p align="center">
  <a href="https://david-dm.org/flocasts/flo-angular">
    <img alt="deps" src="https://david-dm.org/flocasts/flo-angular/status.svg">
  </a>
  <a href="https://david-dm.org/flocasts/flo-angular?type=dev">
    <img alt="dev-deps" src="https://david-dm.org/flocasts/flo-angular/dev-status.svg">
  </a>
</p>
<p align="center">
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
  <a href="LICENSE.md">
    <img alt="license" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## Current Libraries
| Package       | Description   | Latest |
| ------------- | ------------- | -------|
| [ng-styles](projects/flosportsinc/ng-styles) | FloSports Stylesheets | [![](https://img.shields.io/npm/v/@flosportsinc/ng-styles.svg)](https://www.npmjs.com/package/@flosportsinc/ng-styles)
| [ng-icons](projects/flosportsinc/ng-icons) | FloSports Icons | [![](https://img.shields.io/npm/v/@flosportsinc/ng-icons.svg)](https://www.npmjs.com/package/@flosportsinc/ng-icons)
| [ng-window](projects/flosportsinc/ng-window) | Window object for Node and unit testing | [![](https://img.shields.io/npm/v/@flosportsinc/ng-window.svg)](https://www.npmjs.com/package/@flosportsinc/ng-window)
| [ng-fullscreen](projects/flosportsinc/ng-fullscreen) | HTML5 Fullscreen utilities | [![](https://img.shields.io/npm/v/@flosportsinc/ng-fullscreen.svg)](https://www.npmjs.com/package/@flosportsinc/ng-fullscreen)
| [ng-ad-block](projects/flosportsinc/ng-ad-block) | For detecting ad blockers | [![](https://img.shields.io/npm/v/@flosportsinc/ng-ad-block.svg)](https://www.npmjs.com/package/@flosportsinc/ng-ad-block)
| [ng-http-cache-tags](projects/flosportsinc/ng-http-cache-tags) | HTTP tag caching | [![](https://img.shields.io/npm/v/@flosportsinc/ng-http-cache-tags.svg)](https://www.npmjs.com/package/@flosportsinc/ng-http-cache-tags)
| [ng-universal-services](projects/flosportsinc/ng-universal-services) | Common services for Angular Universal | [![](https://img.shields.io/npm/v/@flosportsinc/ng-universal-services.svg)](https://www.npmjs.com/package/@flosportsinc/ng-universal-services)
| [ng-svg-transfer-state](projects/flosportsinc/ng-svg-transfer-state) | Sync SVGs between server and browser | [![](https://img.shields.io/npm/v/@flosportsinc/ng-svg-transfer-state.svg)](https://www.npmjs.com/package/@flosportsinc/ng-svg-transfer-state)
| [ng-env-transfer-state](projects/flosportsinc/ng-env-transfer-state) | Transfer Node Environment variables | [![](https://img.shields.io/npm/v/@flosportsinc/ng-env-transfer-state.svg)](https://www.npmjs.com/package/@flosportsinc/ng-env-transfer-state)
| [ng-media-source-extensions](projects/flosportsinc/ng-media-source-extensions) | Media Source Extensions for HLS/DASH | [![](https://img.shields.io/npm/v/@flosportsinc/ng-media-source-extensions.svg)](https://www.npmjs.com/package/@flosportsinc/ng-media-source-extensions)
| [ng-grid-list](projects/flosportsinc/ng-grid-list) | Theater style grid for Angular Universal | [![](https://img.shields.io/npm/v/@flosportsinc/ng-grid-list.svg)](https://www.npmjs.com/package/@flosportsinc/ng-grid-list)
| [ng-tabs](projects/flosportsinc/ng-tabs) | Tabs | [![](https://img.shields.io/npm/v/@flosportsinc/ng-tabs.svg)](https://www.npmjs.com/package/@flosportsinc/ng-tabs)
| [ng-ima](projects/flosportsinc/ng-ima) | Goolge IMA adapter for Angular | [![](https://img.shields.io/npm/v/@flosportsinc/ng-ima.svg)](https://www.npmjs.com/package/@flosportsinc/ng-ima)
| [ng-video-autoplay](projects/flosportsinc/ng-video-autoplay) | Video Autoplay | [![](https://img.shields.io/npm/v/@flosportsinc/ng-video-autoplay.svg)](https://www.npmjs.com/package/@flosportsinc/ng-video-autoplay)
| [ng-video-player](projects/flosportsinc/ng-video-player) | Extensible HTML5 based video player | [![](https://img.shields.io/npm/v/@flosportsinc/ng-video-player.svg)](https://www.npmjs.com/package/@flosportsinc/ng-video-player)
| [ng-lazy-load](projects/flosportsinc/ng-lazy-load) | Extensible HTML5 based video player | [![](https://img.shields.io/npm/v/@flosportsinc/ng-lazy-load.svg)](https://www.npmjs.com/package/@flosportsinc/ng-lazy-load)

## Developing a New Project

 1. [Create a New Library](#create-a-new-library)
 2. [Update Server tsconfig](#update-server-tsconfig)
 3. [Write the Library](#write-the-library)
 4. [Create the Sample Page](#create-the-sample-page)
 5. [Write Tests](#write-tests)
 6. [Add to Main Readme](#add-to-main-readme)
 
### Create a New Library

To create a new library in this project, use a command like the following:

```shell script
npm run ng g lib @flosportsinc/ng-<your-library-name> --prefix flo
```

This will generate all of the files you need to start working on your library.
It will also register the library path in the main tsconfig.

### Update Server tsconfig

Once your library is generated, you'll need to add the config generated for 
the main tsconfig to the [server tsconfig](./src/tsconfig.server.json).

You'll need to copy these path configs from the 
[main tsconfig](./tsconfig.json). There are two ways you can do this:

  * Git Diff
  * Quick copy
  
If you diff the main tsconfig, you should see a change like this:
  
```shell script
diff --git a/tsconfig.json b/tsconfig.json
index 8eb42c0..40cea21 100644
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -124,6 +124,12 @@
       ],
       "@flosportsinc/ng-lazy-load/*": [
         "dist/flosportsinc/ng-lazy-load/*"
+      ],
+      "@flosportsinc/ng-test": [
+        "dist/flosportsinc/ng-test"
+      ],
+      "@flosportsinc/ng-test/*": [
+        "dist/flosportsinc/ng-test/*"
       ]
     }
   }
```

You'll need to add those new lines into the 
[server tsconfig](./src/tsconfig.server.json) under the paths key.

Alternatively, you can get the lines to add by running this command in the
project root:

```shell script
# Omit `| pbcopy` if it is not available on your system and copy it manually
grep -A1 -i ng-lazy-load tsconfig.json | sed '4d' | pbcopy
```

This will put the added lines directly into your clipboard, and you can paste
them into the server tsconfig.

### Write the Library

You can now navigate to the [project directory](./projects/flosportsinc) and
into your library. First, review the generated files. Make any updates you
feel are necessary. Replace the content of karma.conf.js with this:

```js
const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage/ng-http-cache-tags')()()
```

Other than that, everything else is pretty much ready to go. Remember to
export all of your public modules in your public_api.ts.

### Create the Sample Page

In order to test and provide live documentation and examples of your library,
add a new set of components to the app.

```shell script
npm run ng g c your-library-name --module app
```

You may import your library in the [Flo Module](./src/app/flo.module.ts), or
you can create your own module if manual configuration is required.

You should take a look at the [hls library](./src/app/hls) as an example of 
how to produce rich and accurate documentation for your new library.

### Write Tests

Spec files can be included in your library folder. You can also write E2E
tests using protractor in [this directory](./e2e/src). Feel free to write
tests earlier in your process, but you must cover your code wherever possible.

### Add to Main Readme

Add your library to the table in readme. Copy another one of the lines in the
[library list](#current-libraries) and replace the relevant parts with the
name of your library.

### Add CI Step

In order to make sure CircleCI tests your new library, you'll have to add it
to [circle.yml](circle.yml). There are several examples under the `jobs` key,
and you can simply copy one of them and replace the library name with your 
own.

Example:
```yaml
test_my-library:
    <<: *defaults
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Test
          command: |
            npm run test @flosportsinc/ng-my-libary -- --watch=false --progress=false --browsers=ChromeHeadlessCI
            ./cc-test-reporter format-coverage -t lcov -o ./cc.ng-my-library.json ./coverage/ng-my-library/lcov.info
      - persist_to_workspace:
          root: .
          paths:
            - cc.ng-my-library.json
```

## Building ALL libraries
Run `npm run build.lib`.

## Development server
Run `npm run ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `npm run ng generate component component-name` to generate a new component. You can also use `npm run ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `npm run ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests
Run `npm run ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `npm run ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help
To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## License
The MIT License (MIT)  
Copyright (c) 2019 FloSports

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
