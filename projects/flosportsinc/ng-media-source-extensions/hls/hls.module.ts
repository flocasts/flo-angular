import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  IMseDestroy,
  IMseInit,
  IMsePatternCheck,
  IMsePatternCheckFunc,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IVideoElementSupportsTargetMseCheckContext,
  FloMseModule
} from '@flosportsinc/ng-media-source-extensions'
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core'
import * as Hls from 'hls.js'

const exectionKey = 'HLS'
export const MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG = new InjectionToken('fs.mse.lib.hls.init.cfg')

export interface HlsMessage {
  readonly key: keyof typeof Hls.Events
  readonly message: any
}

export interface IFloHlsModuleConfig {
  readonly selfHeal: boolean
}

export interface IHlsModuleConfig {
  readonly floConfig: Partial<IFloHlsModuleConfig>
  readonly hlsConfig: Partial<Hls.Config>
}

export const DEFAULT_MODULE_CONFIG: IHlsModuleConfig = {
  floConfig: {
    selfHeal: true
  },
  hlsConfig: {}
}

export function defaultIsSupportedFactory() {
  const func = () => Hls.isSupported()
  return {
    exectionKey,
    func
  }
}

export function defaultHlsSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheckContext {
  const func: IVideoElementSupportsTargetMseCheck = ve =>
    typeof ve.canPlayType === 'function' && ve.canPlayType('application/vnd.apple.mpegurl') === 'probably'
  return {
    exectionKey,
    func
  }
}

export const selfHealSwitch = (client: Hls, errorData: Hls.errorData) => {
  // tslint:disable-next-line: no-if-statement
  if (!errorData.fatal) { return }

  switch (errorData.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      console.log('Fatal network error encountered, trying to recover', errorData.details)
      client.startLoad()
      break
    case Hls.ErrorTypes.MEDIA_ERROR:
      console.log('Fatal media error encountered, trying to recover', errorData.details)
      client.recoverMediaError()
      break
    default:
      console.log('Fatal error, hls client destroyed', errorData.details)
      client.destroy()
      break
  }
}

export const selfHealFunc = (client: Hls) => {
  client.on(Hls.Events.ERROR, (_, data) => selfHealSwitch(client, data))
}

// TODO: if another Media Error is raised 'quickly' after this first Media Error,
// TODO: first call hls.swapAudioCodec(), then call hls.recoverMediaError().
export function defaultMseClientInitFunction(config: IHlsModuleConfig): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls(config.hlsConfig)
    Object.keys(Hls.Events).forEach(k => {
      client.on(Hls.Events[k], (key: any, message) => initEvent.messageSource.next({ key, message }))
    })

    // setup fatal error recovery if selfHeal = true
    config.floConfig.selfHeal && selfHealFunc(client)

    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    return client
  }
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientDestroyFunction(): IMseDestroy<Hls> {
  const func: IMseDestroyFunc<Hls> = destroyEvent => {
    destroyEvent.clientRef.stopLoad()
    destroyEvent.clientRef.detachMedia()
    destroyEvent.clientRef.destroy()
  }
  return {
    exectionKey,
    func
  }
}

export function defaultHlsPatternCheck(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.m3u8')
  return {
    exectionKey,
    func
  }
}

@NgModule({
  imports: [FloMseModule],
  exports: [FloMseModule],
  providers: [
    {
      provide: MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG,
      useValue: DEFAULT_MODULE_CONFIG
    },
    {
      provide: SUPPORTS_MSE_TARGET_NATIVELY,
      useFactory: defaultHlsSupportedNativelyFunction,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: defaultIsSupportedFactory,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: defaultMseClientInitFunction,
      deps: [MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG],
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultMseClientDestroyFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultHlsPatternCheck,
      multi: true
    }
  ]
})
export class FloHlsModule {
  static config(config: Partial<IHlsModuleConfig> = DEFAULT_MODULE_CONFIG): ModuleWithProviders {
    return {
      ngModule: FloHlsModule,
      providers: [
        {
          provide: MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG,
          useValue: {
            floConfig: {
              ...DEFAULT_MODULE_CONFIG.floConfig,
              ...config.floConfig
            },
            hlsConfig: {
              ...DEFAULT_MODULE_CONFIG.hlsConfig,
              ...config.hlsConfig
            }
          }
        }
      ]
    }
  }
}
