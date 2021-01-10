import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerRoutingModule } from './scroller-routing.module';
import { ScrollerComponent } from './scroller/scroller.component';
import { CameraComponent } from './scroller/camera/camera.component';
import { SharedModule } from '../shared/shared.module';
import { AllowCameraComponent } from './scroller/allow-camera/allow-camera.component';
import { NgbDropdownModule, NgbModalModule, NgbButtonsModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockedCameraComponent } from './scroller/blocked-camera/blocked-camera.component';
import { TutorialComponent } from './scroller/tutorial/tutorial.component';
import { ConfigComponent } from './scroller/config/config.component';
import { ConfigModalComponent } from './scroller/config-modal/config-modal.component';
import { FormsModule } from '@angular/forms';
import { MobileWarningComponent } from './scroller/mobile-warning/mobile-warning.component';

@NgModule({
  declarations: [
    ScrollerComponent,
    CameraComponent,
    AllowCameraComponent,
    BlockedCameraComponent,
    TutorialComponent,
    ConfigComponent,
    ConfigModalComponent,
    MobileWarningComponent,
  ],
  imports: [
    CommonModule,
    ScrollerRoutingModule,
    SharedModule,
    NgbModalModule,
    NgbRatingModule,
    NgbDropdownModule,
    NgbButtonsModule,
    FormsModule,
    NgbTooltipModule
  ],
})
export class ScrollerModule {}
