import { Directive, ChangeDetectorRef, HostListener } from '@angular/core'
import { FloMediaPlayerControlBaseDirective } from '../mp-base.directive'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export abstract class FloMediaPlayerControlSkipDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  constructor(protected cd: ChangeDetectorRef) {
    super()
  }

  protected abstract skipTimeFunc: (videoElement: HTMLVideoElement) => void
  protected abstract inputKey: string

  protected getInput = () => {
    const ref = this[this.inputKey]
    if (ref && typeof ref === 'number') {
      return ref / 1000
    } else {
      return 0
    }
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    const input = this.getInput()

    if (!input) { return }

    this.mediaElementRef
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome(this.skipTimeFunc)
  }
}

const SKIP_BACK_SELECTOR = 'floMpClickToSkipBack'

@Directive({
  selector: `[floMp][${SKIP_BACK_SELECTOR}]`,
  inputs: [SKIP_BACK_SELECTOR]
})
export class FloMediaPlayerControlSkipBackDirective<TMeta = any> extends FloMediaPlayerControlSkipDirective<TMeta> {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd)
  }
  protected skipTimeFunc = (ve: HTMLVideoElement) => ve.currentTime = ve.currentTime - this.getInput()
  protected inputKey = SKIP_BACK_SELECTOR
}

const SKIP_FORWARD_SELECTOR = 'floMpClickToSkipForward'

@Directive({
  selector: `[floMp][${SKIP_FORWARD_SELECTOR}]`,
  inputs: [SKIP_FORWARD_SELECTOR]
})
export class FloMediaPlayerControlSkipForwardDirective<TMeta = any> extends FloMediaPlayerControlSkipDirective<TMeta> {
  constructor(protected cd: ChangeDetectorRef) {
    super(cd)
  }
  protected skipTimeFunc = (ve: HTMLVideoElement) => ve.currentTime = ve.currentTime + this.getInput()
  protected inputKey = SKIP_FORWARD_SELECTOR
}
