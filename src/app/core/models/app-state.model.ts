import { CameraStatus } from 'src/app/core/models/camera-status.model';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';
import { ScrollerError } from 'src/app/core/models/error.model';
import { CurrentWebsite } from 'src/app/core/models/current-website.model';
import { ProxyResponse } from 'src/app/core/models/proxy-response.model';

export interface AppState {
  speed: number;
  orientation: boolean;
  currentWebsite: CurrentWebsite;
  showTutorial: boolean;
  showMobileWarning: boolean;
  error: ScrollerError;
  cameraStatus: CameraStatus;
  webglStatus: WebglStatus;
  selectedCamera: { id: string };
  isMobile: boolean;
  proxyResponse: ProxyResponse;
}

export const initialState: AppState = {
  speed: 22, // 5,10,15,22,30
  orientation: false,
  currentWebsite: null,
  showTutorial: true,
  showMobileWarning: true,
  error: null,
  webglStatus: WebglStatus.Unknown,
  cameraStatus: CameraStatus.Unknown,
  selectedCamera: null,
  isMobile: undefined,
  proxyResponse: null,
};
