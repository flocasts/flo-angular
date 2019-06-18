import { Directive, HostListener, Input, Inject } from '@angular/core'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { tap, take } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
@Directive({
  selector: '[floClickToEnterFullscreen]',
})
export class FloClickToEnterFullscreenDirective {
  constructor(private fs: FloFullscreenService, @Inject(DOCUMENT) private doc: any) { }

  private _thing: HTMLElement | HTMLDocument

  @Input()
  get floClickToEnterFullscreen() {
    return this._thing
  }
  set floClickToEnterFullscreen(val: any) {
    if (val instanceof HTMLElement) {
      this._thing = val
    } else {
      this._thing = this.doc.body
    }
  }

  @HostListener('click', []) click() {
    this.fs.isNotFullscreen$.pipe(tap(_ => {
      setTimeout(() => {
        this.fs.goFullscreen(this.floClickToEnterFullscreen)
      })
    })).pipe(take(1)).subscribe()
  }
}

@Directive({
  selector: '[floClickToExitFullscreen]',
})
export class FloClickToExitFullscreenDirective {
  constructor(private fs: FloFullscreenService) { }

  @HostListener('click', []) click() {
    this.fs.exitFullscreen()
  }
}
