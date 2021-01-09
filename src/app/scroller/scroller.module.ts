import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerRoutingModule } from './scroller-routing.module';
import { ScrollerComponent } from './scroller/scroller.component';
import { CameraComponent } from './scroller/camera/camera.component';
import { SharedModule } from '../shared/shared.module';
import { AllowCameraComponent } from './scroller/allow-camera/allow-camera.component';
import { NgbModalModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockedCameraComponent } from './scroller/blocked-camera/blocked-camera.component';
import { TutorialComponent } from './scroller/tutorial/tutorial.component';
import { ConfigComponent } from './scroller/config/config.component';
import { ConfigModalComponent } from './scroller/config-modal/config-modal.component';

@NgModule({
  declarations: [
    ScrollerComponent,
    CameraComponent,
    AllowCameraComponent,
    BlockedCameraComponent,
    TutorialComponent,
    ConfigComponent,
    ConfigModalComponent,
  ],
  imports: [CommonModule, ScrollerRoutingModule, SharedModule, NgbModalModule, NgbRatingModule],
})
export class ScrollerModule {}
