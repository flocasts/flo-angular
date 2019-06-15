import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { merge, fromEvent, Observable, BehaviorSubject } from 'rxjs'
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators'
import { DOCUMENT, isPlatformServer } from '@angular/common'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_ELEMENT,
  FS_FULLSCREEN_CHANGE_EVENTS, FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FullscreenRequestEvents,
  FullscreenExitEvents, FullscreenElementKeys, FullscreenChangeEvents, FullscreenErrorEvents
} from './ng-fullscreen.tokens'

const isDocumentFullscreen =
  (platformKeys: ReadonlyArray<string>) =>
    (doc: HTMLDocument) =>
      platformKeys.reduce((acc, curr) => acc || doc[curr] ? true : false, false)

const fullscreenChangeError =
  (platformKeys: ReadonlyArray<string>) =>
    (doc: HTMLDocument) =>
      (takeUntilSource: Observable<any>) =>
        merge(...platformKeys.map(key => fromEvent(doc, key))).pipe(debounceTime(0), takeUntil(takeUntilSource))

const filterAndExecute =
  (ref: HTMLElement | HTMLDocument) =>
    (arr: ReadonlyArray<string>) => arr.
      filter(a => typeof ref[a] === 'function')
      .forEach(a => ref[a]())

@Injectable({
  providedIn: 'root'
})
export class FloFullscreenService {
  // tslint:disable: readonly-array
  constructor(
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(FS_FULLSCREEN_REQUEST_EVENTS) private requestEventKeys: FullscreenRequestEvents[],
    @Inject(FS_FULLSCREEN_EXIT_EVENTS) private exitEventKeys: FullscreenExitEvents[],
    @Inject(FS_FULLSCREEN_ELEMENT) private elementKeys: FullscreenElementKeys[],
    @Inject(FS_FULLSCREEN_CHANGE_EVENTS) private changeEventKeys: FullscreenChangeEvents[],
    @Inject(FS_FULLSCREEN_ELEMENT_ERROR_EVENTS) private elementErrorEventKeys: FullscreenErrorEvents[]
  ) {
    merge(...this.changeEventKeys.map(key => fromEvent(doc, key))).pipe(
      debounceTime(0),
      map(_ => this.computeIsDocumentFullscreen())
    ).subscribe(d => this.source.next(d))
  }

  public readonly computeIsDocumentFullscreen = (doc: HTMLDocument = this.doc) => isDocumentFullscreen(this.elementKeys)(doc)

  private readonly source = new BehaviorSubject(this.computeIsDocumentFullscreen())
  public readonly isFullscreen$ = this.source.asObservable()
  public readonly isFullscreen = () => this.source.getValue()

  public readonly fullscreenChangeError$ = fullscreenChangeError(this.elementErrorEventKeys)(this.doc)

  public readonly fullscreenIsSupported = () => isPlatformServer(this.platformId) ? false : true // TODO
  public readonly canGoFullscreen = () => isPlatformServer(this.platformId) ? false : true // TODO!
  public readonly goFullscreen = (elm: HTMLElement | HTMLDocument = this.doc) => filterAndExecute(elm)(this.requestEventKeys)
  public readonly exitFullscreen = () => filterAndExecute(this.doc)(this.exitEventKeys)
}

