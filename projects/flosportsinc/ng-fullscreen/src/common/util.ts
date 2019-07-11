export const isIphone = () => typeof window === 'undefined' || typeof window.navigator === 'undefined'
  ? false
  : window.navigator.userAgent.match(/iPhone/)
    ? true :
    false
