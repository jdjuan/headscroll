import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { CameraStatus } from 'src/app/core/models/camera-status.model';
import { StoreService } from 'src/app/core/services/store.service';
import { ErrorType } from 'src/app/core/models/error.model';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  readonly CAMERA_PERMISSION_TIMEOUT = 3000;

  constructor(private storeService: StoreService) {}

  async requestCameraAccess(): Promise<void> {
    this.startTimeoutTimer();
    try {
      await navigator.mediaDevices.getUserMedia({ video: { frameRate: 24, facingMode: 'user' } });
      this.storeService.updateState({ cameraStatus: CameraStatus.Ready });
    } catch (error) {
      this.storeService.updateState({ cameraStatus: CameraStatus.Blocked });
    }
  }

  startTimeoutTimer(): void {
    const cameraStatus$ = this.storeService.select((state) => state.cameraStatus);
    interval(this.CAMERA_PERMISSION_TIMEOUT)
      .pipe(take(1), withLatestFrom(cameraStatus$))
      .subscribe(([, cameraStatus]) => {
        if (cameraStatus === CameraStatus.Unknown) {
          this.storeService.updateState({ cameraStatus: CameraStatus.TimedOut });
        }
      });
  }

  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      return cameras;
    } catch (error) {
      this.storeService.dispatchError(ErrorType.CameraBlocked);
      return null;
    }
  }
}
