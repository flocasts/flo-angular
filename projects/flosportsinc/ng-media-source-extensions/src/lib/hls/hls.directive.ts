import { Directive } from '@angular/core'
import { MseDirective } from '../mse/mse.directive'
import * as Hls from 'hls.js'

export interface HlsMessage {
  readonly key: keyof typeof Hls.Events
  readonly message: any
}

@Directive({
  selector: 'video[floHls]'
})
export class HlsDirective extends MseDirective<Hls, HlsMessage> { }
