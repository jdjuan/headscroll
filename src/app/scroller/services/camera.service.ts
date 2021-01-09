import { Injectable } from '@angular/core';
import { BehaviorSubject, from, merge, Observable, Subject, interval, of } from 'rxjs';
import { catchError, distinct, mapTo, take, tap } from 'rxjs/operators';

export enum CameraStates {
  Allowed = 'Camera is allowed',
  Blocked = 'Camera is blocked',
  Timeout = 'Camera request timed out',
}

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  // tslint:disable-next-line: variable-name
  private _selectedCamera$ = new Subject<string>();
  // tslint:disable-next-line: variable-name
  private _showSkeleton$ = new BehaviorSubject<boolean>(true);

  readonly CAMERA_PERMISSION_TIMEOUT = 2000;

  constructor() {}

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

  toggleSkeleton(showSkeleton: boolean): void {
    this._showSkeleton$.next(showSkeleton);
  }

  get selectedCamera$(): Observable<string> {
    return this._selectedCamera$.pipe(distinct());
  }

  get showSkeleton$(): Observable<boolean> {
    return this._showSkeleton$.asObservable();
  }
}
