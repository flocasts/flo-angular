import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  IMseSrcChangeFunc,
  IMseInit,
  IMseDestroy,
  IMseSrcChange,
  IMsePatternCheck,
  IMsePatternCheckFunc,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH
} from '@flosportsinc/ng-media-source-extensions'
import { NgModule } from '@angular/core'
// import { DashMessage } from './dash.directive'

const exectionKey = 'DASH'

export function defaultDashServerIsSupportedFactory() {
  return false
}

export function defaultDashServerSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheck {
  const dash: IVideoElementSupportsTargetMseCheck = ve => false
  return dash
}

export function defaultDashClientServerInitFunction(): IMseInit<any, any> {
  const func: IMseInitFunc<any, any> = initEvent => {
    return undefined
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashClientServerSrcChangeFunction(): IMseSrcChange<any> {
  const func: IMseSrcChangeFunc<any> = srcChangeEvent => {
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashClientServerDestroyFunction(): IMseDestroy<any> {
  const func: IMseDestroyFunc<any> = destroyEvent => {
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashServerPatternCheck(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.mpd')
  return {
    exectionKey,
    func
  }
}

@NgModule({
  providers: [
    {
      provide: SUPPORTS_MSE_TARGET_NATIVELY,
      useFactory: defaultDashServerSupportedNativelyFunction,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: defaultDashServerIsSupportedFactory,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: defaultDashClientServerInitFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: defaultDashClientServerSrcChangeFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultDashClientServerDestroyFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultDashServerPatternCheck,
      multi: true
    }
  ]
})
export class DashServerModule { }
