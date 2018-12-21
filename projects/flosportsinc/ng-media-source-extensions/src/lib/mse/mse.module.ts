import { NgModule } from '@angular/core'
import { MseDirective } from './mse.directive'
import {
  SUPPORTS_MSE_TARGET_NATIVELY, SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH
} from './mse.tokens'

export function falseFunc() {
  return false
}

const exectionKey = 'default'
const useValue = { func: falseFunc, exectionKey }

@NgModule({
  declarations: [MseDirective],
  exports: [MseDirective],
  providers: [
    {
      provide: SUPPORTS_MSE_TARGET_NATIVELY,
      useValue,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useValue,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useValue,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useValue,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useValue,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useValue,
      multi: true
    }
  ]
})
export class MseModule { }
