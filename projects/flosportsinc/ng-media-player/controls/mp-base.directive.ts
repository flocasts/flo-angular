import { Input } from '@angular/core'
import { maybe, IMaybe } from 'typescript-monads'

// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

export abstract class FloMediaPlayerControlBaseDirective<TMeta = any> {
  private _mediaElementRef = maybe<HTMLMediaElement>()

  @Input('floMp')
  get mediaElementRef() {
    return this._mediaElementRef
  }

  set mediaElementRef (val: IMaybe<HTMLMediaElement>) {
    this._mediaElementRef = maybe<HTMLMediaElement>(val as any).filter(ve => ve instanceof HTMLMediaElement)
  }

  @Input() readonly floMpMeta?: TMeta
}

export const coerceInputToBoolean = (val: any) => val !== 'false' && val !== false ? true : false
