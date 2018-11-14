import { Directive } from '@angular/core'
import { MseDirective } from '../mse/mse.directive'

export interface DashMessage {
  readonly key: string
  readonly message: any
}

@Directive({
  selector: 'video[floDash]'
})
export class DashDirective extends MseDirective<Hls, DashMessage> { }
