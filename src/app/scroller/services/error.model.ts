export enum ErrorType {
  Timeout = 'TimeoutError',
  Http = 'HttpErrorResponse',
  Required = 'UrlIsRequired',
  NotSupported = 'NotSupported',
}

export const ErrorMessages: Record<ErrorType, string> = {
  [ErrorType.Timeout]: 'It took a while to display this website, please reload the website, or try another',
  [ErrorType.Http]: 'We could not display this website, please try another one.',
  [ErrorType.Required]: 'Enter the URL of the website you wish to scroll.',
  [ErrorType.NotSupported]: 'This website is not supported yet. But if you think it should, then let us know!',
};

export interface ScrollerError {
  type: ErrorType;
  message?: string;
}
