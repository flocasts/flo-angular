import { InjectionToken } from '@angular/core'
import { Observable } from 'rxjs'

export const AD_BLOCK_LOADER = new InjectionToken<Observable<boolean>>('fs.ab.loader')
