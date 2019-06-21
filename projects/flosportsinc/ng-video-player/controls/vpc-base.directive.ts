import { Inject, PLATFORM_ID, Input } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { maybe } from 'typescript-monads'

export abstract class FloMediaPlayerControlDirectiveBase<TMeta = any> {
  constructor(@Inject(PLATFORM_ID) protected platformId: string) { }

  @Input() readonly floVpc?: HTMLMediaElement
  @Input() readonly floVpcMeta?: TMeta

  protected readonly maybeMediaElement = () => isPlatformBrowser(this.platformId)
    ? maybe(this.floVpc).filter(ve => ve instanceof HTMLMediaElement)
    : maybe<HTMLMediaElement>()
}

export const coerceInputToBoolean = (val: any) => val !== 'false' && val !== false ? true : false
