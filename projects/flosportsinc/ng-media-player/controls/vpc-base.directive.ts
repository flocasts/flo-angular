import { Input } from '@angular/core'
import { maybe } from 'typescript-monads'

export abstract class FloMediaPlayerControlDirectiveBase<TMeta = any> {
  @Input() readonly floVpc?: HTMLMediaElement
  @Input() readonly floVpcMeta?: TMeta

  protected readonly maybeMediaElement = () => maybe(this.floVpc).filter(ve => ve instanceof HTMLMediaElement)
}

export const coerceInputToBoolean = (val: any) => val !== 'false' && val !== false ? true : false
