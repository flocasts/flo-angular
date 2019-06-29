import { Directive, HostListener, Inject, ChangeDetectorRef, PLATFORM_ID, ElementRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mpc-base.directive'
import {
  MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC, RepeatControlFunction,
  MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC
} from './mpc-repeat.tokens'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export abstract class FloMediaPlayerRepeatControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(protected cd: ChangeDetectorRef, protected elmRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  protected abstract inputKey: string
  protected abstract executionFunc: RepeatControlFunction

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    this.maybeMediaElement().tapSome(ve => {
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
    @Inject(PLATFORM_ID) protected platformId: string,
    @Inject(MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC) protected func: RepeatControlFunction) {
    super(cd, elmRef, platformId)
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
    @Inject(PLATFORM_ID) protected platformId: string,
    @Inject(MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC) protected func: RepeatControlFunction) {
    super(cd, elmRef, platformId)
  }

  inputKey = DISABLE_SELECTOR
  executionFunc = (ve: HTMLMediaElement) => ve.loop = false
}
