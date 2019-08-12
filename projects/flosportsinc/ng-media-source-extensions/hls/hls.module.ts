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
export const MEDIA_SOURCE_EXTENSION_HLS_MODULE_CONFIG = new InjectionToken('fs.mse.lib.hls.init.cfg.mdl')
export const MEDIA_SOURCE_EXTENSION_HLS_CONFIG = new InjectionToken('fs.mse.lib.hls.init.cfg')
export const MEDIA_SOURCE_EXTENSION_SELF_HEAL = new InjectionToken('fs.mse.lib.cfg.selfHeal')
export const DEFAULT_MEDIA_SOURCE_EXTENSION_SELF_HEAL = true

export interface HlsMessage {
  readonly key: keyof typeof Hls.Events
  readonly message: any
}

export type IHlsConfig = Hls.Config

export interface IHlsModuleConfig {
  readonly selfHeal: boolean
  readonly hlsConfig: Partial<IHlsConfig>
}

export const DEFAULT_MODULE_HLS_CONFIG: Partial<IHlsConfig> = {
  capLevelToPlayerSize: true,
  startLevel: -1
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
  if (!errorData.fatal) { return }

  const report = { type: errorData.type, details: errorData.details, fatal: true }

  switch (errorData.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      console.log('A fatal network error occurred, trying to recover...', report)
      client.startLoad()
      break
    case Hls.ErrorTypes.MEDIA_ERROR:
      console.log('A fatal media error occurred, trying to recover...', report)
      client.recoverMediaError()
      break
    default:
      console.error('A fatal error occurred, HLS client destroyed.', {
        ...report,
        event: (errorData as any).event,
        message: ((errorData as any).err || {}).message
      })
      client.destroy()
      break
  }
}

export const selfHealFunc = (client: Hls) => {
  client.on(Hls.Events.ERROR, (_, data) => selfHealSwitch(client, data))
}

// TODO: if another Media Error is raised 'quickly' after this first Media Error,
// TODO: first call hls.swapAudioCodec(), then call hls.recoverMediaError().
export function defaultMseClientInitFunction(selfHeal: boolean, hlsConfig: Hls.Config): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls(hlsConfig)
    Object.keys(Hls.Events).forEach(k => {
      client.on(Hls.Events[k], (key: any, message) => initEvent.messageSource.next({ key, message }))
    })

    // setup fatal error recovery if selfHeal = true
    selfHeal && selfHealFunc(client)

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

export function mergeModuleSettings(hlsConfig: Partial<IHlsConfig>) {
  return {
    ...DEFAULT_MODULE_HLS_CONFIG,
    ...hlsConfig
  }
}

@NgModule({
  imports: [FloMseModule],
  exports: [FloMseModule],
  providers: [
    {
      provide: MEDIA_SOURCE_EXTENSION_HLS_CONFIG,
      useValue: DEFAULT_MODULE_HLS_CONFIG
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_SELF_HEAL,
      useValue: DEFAULT_MEDIA_SOURCE_EXTENSION_SELF_HEAL
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
      deps: [MEDIA_SOURCE_EXTENSION_SELF_HEAL, MEDIA_SOURCE_EXTENSION_HLS_CONFIG],
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
  static config(config: Partial<IHlsModuleConfig>): ModuleWithProviders {
    return {
      ngModule: FloHlsModule,
      providers: [
        { provide: MEDIA_SOURCE_EXTENSION_HLS_MODULE_CONFIG, useValue: config.hlsConfig },
        {
          provide: MEDIA_SOURCE_EXTENSION_SELF_HEAL,
          useValue: config.selfHeal === undefined ? DEFAULT_MEDIA_SOURCE_EXTENSION_SELF_HEAL : config.selfHeal
        },
        {
          provide: MEDIA_SOURCE_EXTENSION_HLS_CONFIG,
          deps: [MEDIA_SOURCE_EXTENSION_HLS_MODULE_CONFIG],
          useFactory: mergeModuleSettings
        }
      ]
    }
  }
}
