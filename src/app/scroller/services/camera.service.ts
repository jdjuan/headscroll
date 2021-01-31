import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { interval, of } from 'rxjs';
import { catchError, mapTo, tap, timeout } from 'rxjs/operators';
import { StateService } from 'src/app/core/state.service';
import { ErrorType } from 'src/app/scroller/services/error.model';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  readonly CAMERA_PERMISSION_TIMEOUT = 3000;

  constructor(private stateService: StateService) {}

  hasCameraPermissions(): Observable<boolean> {
    try {
      return from(navigator.mediaDevices.getUserMedia({ video: { frameRate: 24, facingMode: 'user' } })).pipe(
        mapTo(true),
        catchError((error) => {
          console.log(error);
          this.stateService.dispatchError(ErrorType.CameraBlocked);
          return of(false);
        }),
        timeout(this.CAMERA_PERMISSION_TIMEOUT),
        catchError((error) => {
          console.log(error);
          this.stateService.dispatchError(ErrorType.CameraRequestTimedOut);
          return of(false);
        })
      );
    } catch (error) {
      console.log(error);
      this.stateService.dispatchError(ErrorType.CameraBlocked);
      return of(false);
    }
    // try {
    //   const cameraPermission$ = from(navigator.mediaDevices.getUserMedia({ video: true })).pipe(
    //     mapTo(CameraStatus.Allowed),
    //     catchError(() => of(CameraStatus.Blocked))
    //   );
    //   const timeout$ = interval(this.CAMERA_PERMISSION_TIMEOUT).pipe(mapTo(CameraStatus.Timeout));
    //   return merge(cameraPermission$, timeout$).pipe(take(1));
    // } catch (error) {
    //   return of(CameraStatus.Blocked);
    // }
  }

  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      return cameras;
    } catch (error) {
      return null;
    }
  }
}
