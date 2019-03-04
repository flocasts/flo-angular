export const NATIVE_PLAYER_EVENTS: ReadonlyArray<string> = [
  'abort',
  'durationchange',
  'canplay',
  'ended',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'volumechange',
  'waiting'
]

export type FloVideoEventHandler<TEvent = Event> = (
  evt: TEvent,
  videoElement: HTMLVideoElement,
  videoInstanceId: string,
  videoGroupId: string,
  // meta: TMeta,
  eventEmitterFn: (code: number, message?: string, cta?: Function) => void
) => void

 // tslint:disable:readonly-keyword
export interface ListenerDictionary {

  /** Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent. */
  abort?: FloVideoEventHandler

  /**
   * The metadata has loaded or changed, indicating a change in duration of the media.
   * This is sent, for example, when the media has loaded enough that the duration is known.
   */
  durationchange?: FloVideoEventHandler

  /**
   * Sent when enough data is available that the media can be played, at least for a couple of frames.
   * This corresponds to the HAVE_ENOUGH_DATA readyState.'
   */
  canplay?: FloVideoEventHandler

  /** Sent when playback completes. */
  ended?: FloVideoEventHandler

  /** Sent when the playback state is changed to paused (paused property is true). */
  pause?: FloVideoEventHandler

  /** Sent when the playback state is no longer paused, as a result of the play method, or the autoplay attribute. */
  play?: FloVideoEventHandler

  /**
   * Sent when the media has enough data to start playing, after the play event, but also when recovering from being stalled,
   * when looping media restarts, and after seeked, if it was playing before seeking.
   */
  playing?: FloVideoEventHandler

  /**
   * Sent periodically to inform interested parties of progress downloading the media.
   * Information about the current amount of the media that has been downloaded is available
   * in the media element's buffered attribute.
   */
  progress?: FloVideoEventHandler

  /** Sent when the playback speed changes. */
  ratechange?: FloVideoEventHandler

  /** Sent when a seek operation completes. */
  seeked?: FloVideoEventHandler

  /** Sent when a seek operation begins. */
  seeking?: FloVideoEventHandler

  /** Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming. */
  stalled?: FloVideoEventHandler

  /**
   * Sent when loading of the media is suspended; this may happen either because the download has completed or because it has
   * been paused for any other reason.
   */
  suspend?: FloVideoEventHandler

  /** Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed). */
  volumechange?: FloVideoEventHandler

  /** Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek). */
  waiting?: FloVideoEventHandler

  mute?: FloVideoEventHandler

  error?: FloVideoEventHandler
}

