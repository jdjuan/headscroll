import { Injectable } from '@angular/core';
import { from, merge, Observable, Subject, interval, of } from 'rxjs';
import { catchError, mapTo, take } from 'rxjs/operators';

export enum CameraStates {
  Allowed = 'Camera is allowed',
  Blocked = 'Camera is blocked',
  Timeout = 'Camera request timed out',
}

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private _selectedCamera$ = new Subject<string>();
  readonly CAMERA_PERMISSION_TIMEOUT = 2000;

  hasCameraPermission(): Observable<CameraStates> {
    const cameraPermission$ = from(navigator.mediaDevices.getUserMedia({ video: true })).pipe(
      mapTo(CameraStates.Allowed),
      catchError(() => of(CameraStates.Blocked))
    );
    const timeout$ = interval(this.CAMERA_PERMISSION_TIMEOUT).pipe(mapTo(CameraStates.Timeout));
    return merge(cameraPermission$, timeout$).pipe(take(1));
  }

  async getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    return cameras;
  }

  changeCamera(deviceId: string): void {
    this._selectedCamera$.next(deviceId);
  }

  get selectedCamera$(): Observable<string> {
    return this._selectedCamera$.asObservable();
  }
}
