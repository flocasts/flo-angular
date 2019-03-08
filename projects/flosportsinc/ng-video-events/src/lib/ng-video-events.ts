export const NATIVE_PLAYER_EVENTS: ReadonlyArray<string> = [
  'abort',
  'canplay',
  'canplaythrough',
  'durationchange',
  'emptied',
  'ended',
  'error',
  'interruptbegin',
  'interruptend',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting'
]

export type FloVideoEventHandler = (
  videoEvent: Event,
  videoElement: HTMLVideoElement,
  videoInstanceId: string,
  videoGroupId: string,
  // meta: TMeta,
  eventEmitterFn: (code: number, message?: string, cta?: Function) => void
) => void

// tslint:disable:readonly-keyword
export interface ListenerDictionary {
  [key: string]: FloVideoEventHandler | undefined

  /** Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent. */
  abort?: FloVideoEventHandler

  /**
   * Sent when enough data is available that the media can be played, at least for a couple of frames.
   * This corresponds to the HAVE_ENOUGH_DATA readyState.'
   */
  canplay?: FloVideoEventHandler

  /**
   * Sent when the ready state changes to CAN_PLAY_THROUGH, indicating that the entire media can be played without interruption,
   * assuming the download rate remains at least at the current level. It will also be fired when playback is toggled between paused
   * and playing. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox.
   * Other browsers might not fire this event.
   */
  canplaythrough?: FloVideoEventHandler

  /**
   * The metadata has loaded or changed, indicating a change in duration of the media.
   * This is sent, for example, when the media has loaded enough that the duration is known.
   */
  durationchange?: FloVideoEventHandler

  /**
   * The media has become empty; for example, this event is sent if the media has already been loaded
   * (or partially loaded), and the load() method is called to reload it.
   */
  emptied?: FloVideoEventHandler

  /** Sent when playback completes. */
  ended?: FloVideoEventHandler

  /** Sent when an error occurs. */
  error?: FloVideoEventHandler

  /**
   * Sent when audio playing on a Firefox OS device is interrupted, either because the app playing the audio is sent to the background,
   * or audio in a higher priority audio channel begins to play. See Using the AudioChannels API for more details.
   */
  interruptbegin?: FloVideoEventHandler

  /**
   * Sent when previously interrupted audio on a Firefox OS device commences playing again — when the interruption ends.
   * This is when the associated app comes back to the foreground, or when the higher priority audio finished playing.
   * See Using the AudioChannels API for more details.
   */
  interruptend?: FloVideoEventHandler

  /** The first frame of the media has finished loading. */
  loadeddata?: FloVideoEventHandler

  /** The media's metadata has finished loading; all attributes now contain as much useful information as they're going to. */
  loadedmetadata?: FloVideoEventHandler

  /** Sent when loading of the media begins. */
  loadstart?: FloVideoEventHandler

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

  /** The time indicated by the element's currentTime attribute has changed. */
  timeupdate?: FloVideoEventHandler

  /** Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed). */
  volumechange?: FloVideoEventHandler

  /** Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek). */
  waiting?: FloVideoEventHandler
}

