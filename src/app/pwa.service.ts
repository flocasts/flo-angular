import { Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { WindowService } from './window.service'

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
