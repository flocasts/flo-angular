import { Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  constructor(swUpdate: SwUpdate) {
    swUpdate.available.subscribe(_ => {
      window.location.reload()
    })
  }
}
