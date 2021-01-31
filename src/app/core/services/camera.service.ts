import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { CameraStatus } from 'src/app/core/models/camera-status.model';
import { StateService } from 'src/app/core/services/state.service';
import { ErrorType } from 'src/app/core/models/error.model';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  readonly CAMERA_PERMISSION_TIMEOUT = 3000;

  constructor(private stateService: StateService) {}

  async requestCameraAccess(): Promise<void> {
    this.startTimeoutTimer();
    try {
      await navigator.mediaDevices.getUserMedia({ video: { frameRate: 24, facingMode: 'user' } });
      this.stateService.updateState({ cameraStatus: CameraStatus.Ready });
    } catch (error) {
      this.stateService.updateState({ cameraStatus: CameraStatus.Blocked });
    }
  }

  startTimeoutTimer(): void {
    const cameraStatus$ = this.stateService.select((state) => state.cameraStatus);
    interval(this.CAMERA_PERMISSION_TIMEOUT)
      .pipe(take(1), withLatestFrom(cameraStatus$))
      .subscribe(([, cameraStatus]) => {
        if (cameraStatus === CameraStatus.Unknown) {
          this.stateService.updateState({ cameraStatus: CameraStatus.TimedOut });
        }
      });
  }

  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      return cameras;
    } catch (error) {
      this.stateService.dispatchError(ErrorType.CameraBlocked);
      return null;
    }
  }
}
