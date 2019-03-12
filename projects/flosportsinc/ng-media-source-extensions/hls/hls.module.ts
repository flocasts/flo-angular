import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  IMseSrcChangeFunc,
  IMseDestroy,
  IMseInit,
  IMseSrcChange,
  IMsePatternCheck,
  IMsePatternCheckFunc,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IVideoElementSupportsTargetMseCheckContext
} from './mse.tokens'
import { MseModule } from './mse.module'
import { NgModule, ModuleWithProviders } from '@angular/core'
import * as Hls from 'hls.js'

const exectionKey = 'HLS'
export const MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG = 'flo.mse.lib.hls.init.config'

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

const DEFAULT_MODULE_CONFIG: IHlsModuleConfig = {
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
    typeof ve.canPlayType === 'function' && ve.canPlayType('application/vnd.apple.mpegurl') &&
      !defaultIsSupportedFactory().func() ? true : false
  return {
    exectionKey,
    func
  }
}

// TODO: if another Media Error is raised 'quickly' after this first Media Error,
// TODO: first call hls.swapAudioCodec(), then call hls.recoverMediaError().
export function defaultMseClientInitFunction(config: IHlsModuleConfig): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls(config.hlsConfig)
    Object.keys(Hls.Events).forEach(k => {
      client.on(Hls.Events[k], (key: any, message) => initEvent.messageSource.next({ key, message }))
    })
    // tslint:disable: no-if-statement
    if (config.floConfig.selfHeal) {
      client.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Fatal network error encountered, trying to recover')
              client.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Fatal media error encountered, trying to recover')
              client.recoverMediaError()
              break
            default:
              console.log('Fatal error, hls client destroyed')
              client.destroy()
              break
          }
        }
      })
    }
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    return client
  }
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientSrcChangeFunction(): IMseSrcChange<Hls> {
  const func: IMseSrcChangeFunc<Hls> = srcChangeEvent => {
    srcChangeEvent.videoElement.pause()
    srcChangeEvent.clientRef.detachMedia()
    srcChangeEvent.clientRef.loadSource(srcChangeEvent.src)
    srcChangeEvent.clientRef.attachMedia(srcChangeEvent.videoElement)
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
  imports: [MseModule],
  exports: [MseModule],
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
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: defaultMseClientSrcChangeFunction,
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
export class HlsModule {
  static config(config: Partial<IHlsModuleConfig> = DEFAULT_MODULE_CONFIG): ModuleWithProviders {
    const _config: IHlsModuleConfig = {
      floConfig: {
        ...DEFAULT_MODULE_CONFIG.floConfig,
        ...config.floConfig
      },
      hlsConfig: {
        ...DEFAULT_MODULE_CONFIG.hlsConfig,
        ...config.hlsConfig
      }
    }

    return {
      ngModule: HlsModule,
      providers: [
        {
          provide: MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG,
          useValue: _config
        }
      ]
    }
  }
}
