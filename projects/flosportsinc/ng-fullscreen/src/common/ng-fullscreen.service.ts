import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { merge, fromEvent, Observable, throwError, of, interval, BehaviorSubject, forkJoin } from 'rxjs'
import {
  debounceTime, map, startWith, shareReplay, filter, flatMap,
  mergeAll, take, tap, toArray, mergeMap, switchMap, takeUntil
} from 'rxjs/operators'
import { DOCUMENT, isPlatformServer } from '@angular/common'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_ELEMENT,
  FS_FULLSCREEN_CHANGE_EVENTS, FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FullscreenRequestEvents,
  FullscreenExitEvents, FullscreenElementKeys, FullscreenChangeEvents, FullscreenErrorEvents,
  FS_FULLSCREEN_ENABLED, FullscreenEnabledKeys, FS_FULLSCREEN_ENABLED_FUNC, FullscreenEnabledFunc
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
    (arr: ReadonlyArray<string>) => arr.
      filter(a => typeof ref[a] === 'function')
      .forEach(a => ref[a]())

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
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(FS_FULLSCREEN_REQUEST_EVENTS) private requestEventKeys: FullscreenRequestEvents[],
    @Inject(FS_FULLSCREEN_EXIT_EVENTS) private exitEventKeys: FullscreenExitEvents[],
    @Inject(FS_FULLSCREEN_ELEMENT) private elementKeys: FullscreenElementKeys[],
    @Inject(FS_FULLSCREEN_CHANGE_EVENTS) private changeEventKeys: FullscreenChangeEvents[],
    @Inject(FS_FULLSCREEN_ELEMENT_ERROR_EVENTS) private elementErrorEventKeys: FullscreenErrorEvents[],
    @Inject(FS_FULLSCREEN_ENABLED) private enabledKeys: FullscreenEnabledKeys[],
    @Inject(FS_FULLSCREEN_ENABLED_FUNC) private enabledFunc: FullscreenEnabledFunc
  ) { }

  private readonly iOSVideoState = new BehaviorSubject<boolean>(false)

  public readonly isFullscreen = (doc: HTMLDocument | HTMLElement = this.doc) => {
    return isPlatformServer(this.platformId) ? false : isKeyTrue(this.elementKeys)(doc) || this.iOSVideoState.getValue()
  }

  public readonly fullscreenError$ = fullscreenChangeError(this.elementErrorEventKeys)(this.doc).pipe(map(e => throwError(e)))

  // webkitendfullscreen: false, webkitbeginfullscreen: true
  private readonly d = (eventName: string, mapToValue: boolean) => <T>(source: Observable<NodeListOf<HTMLVideoElement>[]>) => {
    return source.pipe(
      map(videoElements => videoElements.map(ve => fromEvent(ve, eventName))),
      tap(() => this.iOSVideoState.next(mapToValue))
    )
  }

  public readonly fullscreen$ = merge(
    ...this.changeEventKeys.map(key => fromEvent(this.doc, key)),
    interval(1000).pipe(
      map(() => Array.from((this.doc as HTMLDocument).querySelectorAll('video'))),
      mergeMap(a => [
        ...a.map(v => fromEvent(v, 'webkitbeginfullscreen').pipe(tap(() => this.iOSVideoState.next(true)), take(1))),
        ...a.map(v => fromEvent(v, 'webkitendfullscreen').pipe(tap(() => this.iOSVideoState.next(false)), take(1)))
      ]),
      mergeAll(1)
    ),
    this.fullscreenError$).pipe(
      debounceTime(0),
      map(_ => this.isFullscreen()),
      startWith(this.isFullscreen()),
      shareReplay(1))

  public readonly isFullscreen$ = this.fullscreen$.pipe(filter(v => v === true))
  public readonly isNotFullscreen = this.fullscreen$.pipe(filter(v => v === false))
  public readonly goFullscreen = (elm: HTMLElement | HTMLDocument = this.doc.body) => filterAndExecute(elm)(this.requestEventKeys)
  public readonly exitFullscreen = () => filterAndExecute(this.doc)(this.exitEventKeys)

  public readonly fullscreenIsSupported =
    (elm?: HTMLElement) =>
      isPlatformServer(this.platformId)
        ? of(false)
        : isKeyTrue(this.enabledKeys)(this.doc)
          ? of(true)
          : !elm
            ? of(false)
            : this.enabledFunc(elm)

  public readonly canGoFullscreen =
    (elm?: HTMLElement) =>
      isPlatformServer(this.platformId)
        ? of(false)
        : this.fullscreenIsSupported(elm)
          .pipe(flatMap(isSupported => !isSupported
            ? of(false)
            : this.fullscreen$.pipe(map(isfs => isfs ? false : true))))
}
