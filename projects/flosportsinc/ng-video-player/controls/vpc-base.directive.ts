import { Inject, PLATFORM_ID, Input } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { maybe } from 'typescript-monads'

export abstract class FloVideoPlayerControlDirectiveBase<TMeta = any> {
  constructor(@Inject(PLATFORM_ID) protected platformId: string) { }

  @Input() readonly floVpc?: HTMLVideoElement
  @Input() readonly floVpcMeta?: TMeta

  protected readonly maybeVideoElement = () => isPlatformBrowser(this.platformId)
    ? maybe(this.floVpc).filter(ve => ve instanceof HTMLVideoElement)
    : maybe<HTMLVideoElement>()
}

export const coerceInputToBoolean = (val: any) => val !== 'false' && val !== false ? true : false
