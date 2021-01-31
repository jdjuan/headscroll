import { CameraStatus } from 'src/app/core/models/camera-status.model';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';
import { ScrollerError } from 'src/app/core/models/error.model';

export interface AppState {
  speed: number;
  orientation: boolean;
  currentWebsite: string;
  showTutorial: boolean;
  showMobileWarning: boolean;
  error: ScrollerError;
  cameraStatus: CameraStatus;
  webglStatus: WebglStatus;
  selectedCameraId: string;
}

export const initialState: AppState = {
  speed: 20,
  orientation: false,
  currentWebsite: null,
  showTutorial: true,
  showMobileWarning: true,
  error: null,
  webglStatus: WebglStatus.Unknow,
  cameraStatus: CameraStatus.Unknown,
  selectedCameraId: null,
};