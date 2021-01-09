import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, from, of, interval, merge } from 'rxjs';
import { mapTo, catchError, take, distinct } from 'rxjs/operators';
import { CameraStates } from './camera.service';

// export enum CameraStates {
//   Allowed = 'Camera is allowed',
//   Blocked = 'Camera is blocked',
//   Timeout = 'Camera request timed out',
// }

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _selectedCamera$ = new Subject<string>();
  private _showSkeleton$ = new BehaviorSubject<boolean>(false);
  private _scrollSpeed$ = new BehaviorSubject<number>(5);

  readonly CAMERA_PERMISSION_TIMEOUT = 2000;

  constructor() {}

  updateSpeed(speed: number): void {
    this._scrollSpeed$.next(speed);
  }

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

  // get defaultConfig(): Observable<any> {
    // return this._speed$.asObservable();
  // }
  get scrollSpeed(): Observable<number> {
    return this._scrollSpeed$.asObservable();
  }

  get selectedCamera$(): Observable<string> {
    return this._selectedCamera$.pipe(distinct());
  }

  get showSkeleton$(): Observable<boolean> {
    return this._showSkeleton$.asObservable();
  }
}
