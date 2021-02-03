import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerRoutingModule } from './scroller-routing.module';
import { ScrollerComponent } from './scroller/scroller.component';
import { CameraComponent } from './scroller/camera/camera.component';
import { SharedModule } from '../shared/shared.module';
import { AllowCameraComponent } from './scroller/allow-camera/allow-camera.component';
import { BlockedCameraComponent } from './scroller/blocked-camera/blocked-camera.component';
import { TutorialComponent } from './scroller/tutorial/tutorial.component';
import { ConfigModalComponent } from './scroller/config-modal/config-modal.component';
import { MobileWarningComponent } from './scroller/mobile-warning/mobile-warning.component';
import { LoadingSpinnerComponent } from './scroller/loading-spinner/loading-spinner.component';
import { WebglBlockedComponent } from './scroller/webgl-blocked/webgl-blocked.component';

@NgModule({
  declarations: [
    ScrollerComponent,
    CameraComponent,
    AllowCameraComponent,
    BlockedCameraComponent,
    TutorialComponent,
    ConfigModalComponent,
    MobileWarningComponent,
    LoadingSpinnerComponent,
    WebglBlockedComponent,
  ],
  imports: [CommonModule, ScrollerRoutingModule, SharedModule],
})
export class ScrollerModule {}
