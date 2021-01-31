import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable } from 'rxjs';
import { delay, take, withLatestFrom } from 'rxjs/operators';
import { StateService } from 'src/app/core/services/state.service';
import { AllowCameraComponent } from 'src/app/scroller/scroller/allow-camera/allow-camera.component';
import { BlockedCameraComponent } from 'src/app/scroller/scroller/blocked-camera/blocked-camera.component';
import { MobileWarningComponent } from 'src/app/scroller/scroller/mobile-warning/mobile-warning.component';
import { TutorialComponent } from 'src/app/scroller/scroller/tutorial/tutorial.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private cameraStatus$ = this.stateService.select((state) => state.cameraStatus);

  constructor(private bootstrapModalService: NgbModal, private stateService: StateService) {}

  openEnableCameraModal(): NgbModalRef {
    const ref = this.bootstrapModalService.open(AllowCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed).pipe(withLatestFrom(this.cameraStatus$), take(1)).subscribe(this.triggerCameraStatusCheck);
    return ref;
  }

  openBlockedCameraModal(): void {
    const ref = this.bootstrapModalService.open(BlockedCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed)
      .pipe(take(1), delay(1000), withLatestFrom(this.cameraStatus$))
      .subscribe(this.triggerCameraStatusCheck);
  }

  openWebglNotSupportedModal(): void {
    console.log('WEB GL BLOCKEDDDD');
  }

  openMobileWarning(): Observable<boolean> {
    const ref = this.bootstrapModalService.open(MobileWarningComponent, { centered: true });
    return merge(ref.closed, ref.dismissed).pipe(take(1));
  }

  openInstructionsModal(): Observable<boolean> {
    const ref = this.bootstrapModalService.open(TutorialComponent, { centered: true });
    return merge(ref.closed, ref.dismissed).pipe(take(1));
  }

  triggerCameraStatusCheck = ([, cameraStatus]) => {
    // Trigger state reload to run modal display logic
    this.stateService.updateState({ cameraStatus });
  }
}
