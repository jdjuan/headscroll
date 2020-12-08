import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinct } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  // tslint:disable-next-line: variable-name
  private _selectedCamera$ = new Subject<string>();
  // tslint:disable-next-line: variable-name
  private _showSkeleton$ = new BehaviorSubject<boolean>(true);

  constructor() {}

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
