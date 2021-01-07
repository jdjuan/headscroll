import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerRoutingModule } from './scroller-routing.module';
import { ScrollerComponent } from './scroller/scroller.component';
import { CameraComponent } from './scroller/camera/camera.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ScrollerComponent, CameraComponent],
  imports: [
    CommonModule,
    ScrollerRoutingModule,
    SharedModule
  ]
})
export class ScrollerModule { }
