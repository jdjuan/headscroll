import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable } from 'rxjs';
import { delay, take, tap, withLatestFrom } from 'rxjs/operators';
import { CameraStatus } from 'src/app/core/models/camera-status.model';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';
import { StoreService } from 'src/app/core/services/store.service';
import { AllowCameraComponent } from 'src/app/scroller/scroller/allow-camera/allow-camera.component';
import { BlockedCameraComponent } from 'src/app/scroller/scroller/blocked-camera/blocked-camera.component';
import { ConfigModalComponent } from 'src/app/scroller/scroller/config-modal/config-modal.component';
import { MobileWarningComponent } from 'src/app/scroller/scroller/mobile-warning/mobile-warning.component';
import { TutorialComponent } from 'src/app/scroller/scroller/tutorial/tutorial.component';
import { WebglBlockedComponent } from 'src/app/scroller/scroller/webgl-blocked/webgl-blocked.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private cameraStatus$ = this.storeService.select((state) => state.cameraStatus);
  private webglStatus$ = this.storeService.select((state) => state.webglStatus);

  constructor(private bootstrapModalService: NgbModal, private storeService: StoreService) {}

  openEnableCameraModal(): NgbModalRef {
    let ref = this.bootstrapModalService.open(AllowCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed)
      .pipe(take(1), delay(5000), withLatestFrom(this.cameraStatus$))
      .subscribe(([, cameraStatus]) => {
        if (cameraStatus === CameraStatus.TimedOut) {
          ref = this.openEnableCameraModal();
        }
      });
    return ref;
  }

  openBlockedCameraModal(): void {
    const ref = this.bootstrapModalService.open(BlockedCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed)
      .pipe(take(1), delay(1000), withLatestFrom(this.cameraStatus$))
      .subscribe(([, cameraStatus]) => {
        if (cameraStatus === CameraStatus.Blocked) {
          this.openBlockedCameraModal();
        }
      });
  }

  openWebglNotSupportedModal(): void {
    const ref = this.bootstrapModalService.open(WebglBlockedComponent, { centered: true });
    merge(ref.closed, ref.dismissed)
      .pipe(take(1), delay(1000), withLatestFrom(this.webglStatus$), tap(console.log))
      .subscribe(([, webglStatus]) => {
        if (webglStatus === WebglStatus.NotSupported) {
          this.openWebglNotSupportedModal();
        }
      });
  }

  openMobileWarning(): Observable<boolean> {
    const ref = this.bootstrapModalService.open(MobileWarningComponent, { centered: true });
    return merge(ref.closed, ref.dismissed).pipe(take(1));
  }

  openInstructionsModal(): Observable<boolean> {
    const ref = this.bootstrapModalService.open(TutorialComponent, { centered: true });
    return merge(ref.closed, ref.dismissed).pipe(take(1));
  }

  openConfigModal(): Observable<boolean> {
    const ref = this.bootstrapModalService.open(ConfigModalComponent, { scrollable: true, windowClass: 'config-modal' });
    return merge(ref.closed, ref.dismissed).pipe(take(1));
  }
}
