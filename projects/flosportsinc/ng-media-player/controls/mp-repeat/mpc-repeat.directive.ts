import { Directive, HostListener, Inject, ChangeDetectorRef, ElementRef } from '@angular/core'
import { FloMediaPlayerControlBaseDirective } from '../mp-base.directive'
import {
  MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC, RepeatControlFunction,
  MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC
} from './mpc-repeat.tokens'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export abstract class FloMediaPlayerRepeatControlDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  constructor(protected cd: ChangeDetectorRef, protected elmRef: ElementRef<HTMLElement>) {
    super()
  }

  protected abstract inputKey: string
  protected abstract executionFunc: RepeatControlFunction

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    this.mediaElementRef.tapSome(ve => {
      this.executionFunc(ve, this.elmRef, this.floMpMeta)
    })
  }
}

const ENABLE_SELECTOR = 'floMpClickToEnableRepeat'

@Directive({
  selector: `[floMp][${ENABLE_SELECTOR}]`,
  inputs: [ENABLE_SELECTOR]
})
export class FloMediaPlayerRepeatEnableControlDirective<TMeta = any> extends FloMediaPlayerRepeatControlDirective<TMeta> {
  constructor(protected cd: ChangeDetectorRef, protected elmRef: ElementRef<HTMLElement>,
    @Inject(MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC) protected func: RepeatControlFunction) {
    super(cd, elmRef)
  }

  inputKey = ENABLE_SELECTOR
  executionFunc = this.func
}

const DISABLE_SELECTOR = 'floMpClickToDisableRepeat'

@Directive({
  selector: `[floMp][${DISABLE_SELECTOR}]`,
  inputs: [DISABLE_SELECTOR]
})
export class FloMediaPlayerRepeatDisableControlDirective<TMeta = any> extends FloMediaPlayerRepeatControlDirective<TMeta> {
  constructor(protected cd: ChangeDetectorRef, protected elmRef: ElementRef<HTMLElement>,
    @Inject(MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC) protected func: RepeatControlFunction) {
    super(cd, elmRef)
  }

  inputKey = DISABLE_SELECTOR
  executionFunc = (ve: HTMLMediaElement) => ve.loop = false
}
