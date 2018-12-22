import { Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { WindowService } from '@flosportsinc/ng-universal-services/src/window'

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  constructor(ws: WindowService, swUpdate: SwUpdate) {
    swUpdate.available.subscribe(_ => {
      ws.window().location.reload()
    })
  }
}
