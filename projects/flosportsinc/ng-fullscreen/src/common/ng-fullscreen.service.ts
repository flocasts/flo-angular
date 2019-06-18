import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { merge, fromEvent, Observable, throwError, of } from 'rxjs'
import { debounceTime, map, startWith, shareReplay, filter, mergeMap } from 'rxjs/operators'
import { DOCUMENT, isPlatformServer } from '@angular/common'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_ELEMENT,
  FS_FULLSCREEN_CHANGE_EVENTS, FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FullscreenRequestEvents,
  FullscreenExitEvents, FullscreenElementKeys, FullscreenChangeEvents, FullscreenErrorEvents,
  FS_FULLSCREEN_ENABLED,
  FullscreenEnabledKeys
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
  readonly isNotFullscreen$: Observable<boolean>
  readonly canGoFullscreen$: Observable<boolean>
  readonly fullscreenIsSupported: () => boolean
  readonly goFullscreen: () => void
  readonly exitFullscreen: () => void
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
    @Inject(FS_FULLSCREEN_ENABLED) private enabledKeys: FullscreenEnabledKeys[]
  ) { }

  public readonly isFullscreen = (doc: HTMLDocument | HTMLElement = this.doc) =>
    isPlatformServer(this.platformId) ? false : isKeyTrue(this.elementKeys)(doc)

  private readonly fullscreenChangeError$ = fullscreenChangeError(this.elementErrorEventKeys)(this.doc).pipe(mergeMap(e => throwError(e)))

  public readonly fullscreen$ = merge(...this.changeEventKeys.map(key => fromEvent(this.doc, key)), this.fullscreenChangeError$).pipe(
    debounceTime(0),
    map(_ => this.isFullscreen()),
    startWith(this.isFullscreen()),
    shareReplay(1))

  public readonly isFullscreen$ = this.fullscreen$.pipe(filter(v => v === true))
  public readonly isNotFullscreen$ = this.fullscreen$.pipe(filter(v => v === false))
  public readonly goFullscreen = (elm: HTMLElement | HTMLDocument = this.doc) => filterAndExecute(elm)(this.requestEventKeys)
  public readonly exitFullscreen = () => filterAndExecute(this.doc)(this.exitEventKeys)
  public readonly fullscreenIsSupported = () => isPlatformServer(this.platformId) ? false : isKeyTrue(this.enabledKeys)(this.doc)
  public readonly canGoFullscreen$ = isPlatformServer(this.platformId)
    ? of(false)
    : this.fullscreenIsSupported()
      ? this.fullscreen$.pipe(map(isfs => isfs ? false : true))
      : of(false)
}

