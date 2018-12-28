# FloSports Angular Universal Services
Provides itility services for both server and browser environments for use in Angular Universal applications.

## Modules
| Name                                             | Description   |
| ------------------------------------------------ | ------------- |
| [Ad-Block](src/ad-block/README.md)               | Detect the use of ad-blockers to safely handle control flow around them |
| [Cookies](src/cookies/README.md)                 | Interact with cookies on both server and client in the same way |
| [Window](src/window/README.md)                   | Expose a `window` object to the server environment if needed. Mostly for unit testing |
| [Firebase](src/firebase/README.md)               | Extends firebase library to better support server side rendering |
| [Lazy-Image](src/lazy-image/README.md)           | Lazy loading images
| [Server-Response](src/server-response/README.md) | Server response server responses other than 200
| [Server-SVG](src/server-svg/README.md)           | Sync server-side and external SVG's with client
| [HTTP-Cache-Tag](src/http-cache-tag/README.md)   | HTTP cache busting

## Installation
```sh
npm i @flosportsinc/ng-universal-services
```
