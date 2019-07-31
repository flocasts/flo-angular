import { Inject, PLATFORM_ID, Input } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { maybe } from 'typescript-monads'

export abstract class FloMediaPlayerControlBaseDirective<TMeta = any> {
  constructor(@Inject(PLATFORM_ID) protected platformId: string) { }

  @Input() readonly floMp?: HTMLMediaElement
  @Input() readonly floMpMeta?: TMeta

  protected readonly maybeMediaElement = () => isPlatformBrowser(this.platformId)
    ? maybe(this.floMp).filter(ve => ve instanceof HTMLMediaElement)
    : maybe<HTMLMediaElement>()
}

export const coerceInputToBoolean = (val: any) => val !== 'false' && val !== false ? true : false
