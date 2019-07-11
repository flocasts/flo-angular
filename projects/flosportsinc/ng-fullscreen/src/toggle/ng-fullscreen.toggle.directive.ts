import { Directive, HostListener, Input, Inject, ChangeDetectorRef } from '@angular/core'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { take } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
@Directive({
  selector: '[floClickToEnterFullscreen]',
})
export class FloClickToEnterFullscreenDirective {
  constructor(private fs: FloFullscreenService, @Inject(DOCUMENT) private doc: any, private cd: ChangeDetectorRef) { }

  private _element: HTMLElement | HTMLDocument

  @Input()
  get floClickToEnterFullscreen() {
    return this._element
  }
  set floClickToEnterFullscreen(val: any) {
    if (val instanceof HTMLElement) {
      this._element = val
    } else {
      this._element = this.doc.body
    }
  }

  @HostListener('click', []) click() {
    this.cd.detectChanges()
    this.fs.isNotFullscreen.pipe(take(1)).subscribe(_ => {
      this.fs.goFullscreen(this.floClickToEnterFullscreen)
    })
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
