export enum ErrorType {
  Timeout = 'TimeoutError',
  Http = 'HttpErrorResponse',
  Required = 'UrlIsRequired',
  NotSupported = 'NotSupported',
  CameraNotLoaded = 'CameraNotLoaded',
  CameraBlocked = 'CameraBlocked',
  CameraRequestTimedOut = 'CameraRequestTimedOut',
  ProxyFetchError = 'WhitelistFetchError',
}

export const ErrorMessages: Record<ErrorType, string> = {
  [ErrorType.Timeout]: 'It took a while to display this website, please reload the website, or try another',
  [ErrorType.Http]: 'We could not display this website, please try another one.',
  [ErrorType.Required]: 'Enter the URL of the website you wish to scroll.',
  [ErrorType.NotSupported]: 'This website is not supported yet. But if you think it should, then let us know!',
  [ErrorType.CameraNotLoaded]: 'We could not load your camera. Please reload the website',
  [ErrorType.CameraBlocked]: 'We could not access your camera. Please allow it in your browser',
  [ErrorType.CameraRequestTimedOut]: 'It took very long to access your camera. Please check your camera settings',
  [ErrorType.ProxyFetchError]: 'We could not retrieve the proxy response from our servers',
};

export interface ScrollerError {
  type: ErrorType;
  message?: string;
}
