
import { isIphone } from './util'
import { DOCUMENT, isPlatformServer } from '@angular/common'
import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core'
import { merge, fromEvent, Observable, throwError, of, interval, BehaviorSubject, EMPTY } from 'rxjs'
import {
  debounceTime, map, startWith, shareReplay, filter, flatMap, tap,
  distinctUntilChanged, take, takeUntil
} from 'rxjs/operators'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_ELEMENT,
  FS_FULLSCREEN_CHANGE_EVENTS, FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FullscreenRequestEvents,
  FullscreenExitEvents, FullscreenElementKeys, FullscreenChangeEvents, FullscreenErrorEvents,
  FS_FULLSCREEN_ENABLED, FullscreenEnabledKeys, FS_FULLSCREEN_ENABLED_FUNC, FullscreenEnabledFunc,
  FS_FULLSCREEN_IOS_POLL_MS, FS_FULLSCREEN_IOS_POLL_ENABLED
} from './ng-fullscreen.tokens'

const isKeyTrue =
  (platformKeys: ReadonlyArray<string>) =>
    (doc: HTMLDocument | HTMLElement) =>
      platformKeys.reduce((acc, curr) => acc || doc[curr] ? true : false, false)

const fullscreenChangeError =
  (platformKeys: ReadonlyArray<string>) =>
    (doc: HTMLDocument) =>
      merge(...platformKeys.map(key => fromEvent(doc, key))).pipe(debounceTime(0))

const filterAndExecute =
  (ref: HTMLElement | HTMLDocument) =>
    (arr: ReadonlyArray<string>) => {
      const funcStringIdx = arr.findIndex(a => typeof ref[a] === 'function')
      if (funcStringIdx >= 0) {
        ref[arr[funcStringIdx]]()
      }
    }

export interface IFloFullscreenService {
  readonly fullscreen$: Observable<boolean>
  readonly isFullscreen$: Observable<boolean>
  readonly isNotFullscreen: Observable<boolean>
  readonly exitFullscreen: () => void
  readonly goFullscreen: (elm?: HTMLElement | HTMLDocument) => void
  readonly canGoFullscreen: (elm?: HTMLElement) => Observable<boolean>
  readonly fullscreenIsSupported: (elm?: HTMLElement) => Observable<boolean>
  readonly isFullscreen: (elmOrDoc: HTMLDocument | HTMLElement) => boolean
}

@Injectable({ providedIn: 'root' })
export class FloFullscreenService implements IFloFullscreenService {
  // tslint:disable: readonly-array
  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(FS_FULLSCREEN_REQUEST_EVENTS) private requestEventKeys: FullscreenRequestEvents[],
    @Inject(FS_FULLSCREEN_EXIT_EVENTS) private exitEventKeys: FullscreenExitEvents[],
    @Inject(FS_FULLSCREEN_ELEMENT) private elementKeys: FullscreenElementKeys[],
    @Inject(FS_FULLSCREEN_CHANGE_EVENTS) private changeEventKeys: FullscreenChangeEvents[],
    @Inject(FS_FULLSCREEN_ELEMENT_ERROR_EVENTS) private elementErrorEventKeys: FullscreenErrorEvents[],
    @Inject(FS_FULLSCREEN_ENABLED) private enabledKeys: FullscreenEnabledKeys[],
    @Inject(FS_FULLSCREEN_ENABLED_FUNC) private enabledFunc: FullscreenEnabledFunc,
    @Inject(FS_FULLSCREEN_IOS_POLL_MS) private iosPollrate: number,
    @Inject(FS_FULLSCREEN_IOS_POLL_ENABLED) private iosPollEnabled: boolean
  ) { }

  private readonly iOSVideoState = new BehaviorSubject<boolean>(false)

  public readonly isFullscreen = (doc: HTMLDocument | HTMLElement = this.doc) =>
    isPlatformServer(this.platformId) ? false : isKeyTrue(this.elementKeys)(doc) || this.iOSVideoState.getValue()

  public readonly fullscreenError$ = fullscreenChangeError(this.elementErrorEventKeys)(this.doc).pipe(map(e => throwError(e)))

  private readonly iosVideoBypass = (pasthrough: string[]) => isIphone() ? ['webkitEnterFullscreen'] : pasthrough
  public readonly extractVideoForIphoneIfRequired = (element: HTMLElement) => isIphone() && !(element instanceof HTMLVideoElement)
    ? element.querySelector('video') || element
    : element

  private readonly iosPoller = () => !this.iosPollEnabled
    ? EMPTY
    : this.zone.runOutsideAngular(() =>
      interval(this.iosPollrate).pipe(
        map(() => Array.from((this.doc as HTMLDocument).querySelectorAll('video'))),
        flatMap(videoElements => merge(
          ...videoElements.map(ve => fromEvent(ve, 'webkitbeginfullscreen').pipe(tap(() => this.iOSVideoState.next(true)), take(1))),
          ...videoElements.map(ve => fromEvent(ve, 'webkitendfullscreen').pipe(tap(() => this.iOSVideoState.next(false)), take(1)))
        )), takeUntil(this.iOSVideoState)))

  public readonly fullscreen$ = isPlatformServer(this.platformId)
    ? of(false)
    : merge(
      ...this.changeEventKeys.map(key => fromEvent(this.doc, key)),
      this.fullscreenError$,
      this.iosPoller()).pipe(
        debounceTime(0),
        map(() => this.isFullscreen()),
        distinctUntilChanged(),
        startWith(this.isFullscreen()),
        shareReplay(1))

  public readonly fullscreenIsSupported =
    (elm?: HTMLElement) =>
      (isPlatformServer(this.platformId)
        ? of(false)
        : isKeyTrue(this.enabledKeys)(this.doc)
          ? of(true)
          : !elm
            ? of(false)
            : this.enabledFunc(elm)).pipe(shareReplay(1))

  public readonly canGoFullscreen =
    (elm?: HTMLElement) =>
      (isPlatformServer(this.platformId)
        ? of(false)
        : this.fullscreenIsSupported(elm)
          .pipe(flatMap(isSupported => !isSupported
            ? of(false)
            : this.fullscreen$.pipe(map(isfs => isfs ? false : true))))).pipe(shareReplay(1))

  public readonly isFullscreen$ = this.fullscreen$.pipe(filter(v => v === true))
  public readonly isNotFullscreen = this.fullscreen$.pipe(filter(v => v === false))
  public readonly exitFullscreen = () => filterAndExecute(this.doc)(this.exitEventKeys)
  public readonly goFullscreen = (elm: HTMLElement | HTMLDocument = this.doc.body) =>
    filterAndExecute(elm)(this.iosVideoBypass(this.requestEventKeys))
}
