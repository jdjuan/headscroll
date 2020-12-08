import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit {
  @Input() availableCameras: MediaDeviceInfo[] = [];
  showSkeleton: boolean;

  constructor(private cameraService: CameraService) {
    cameraService.getAvailableCameras().then((cameras) => (this.availableCameras = cameras));
    this.cameraService.showSkeleton$.subscribe((showSkeleton) => (this.showSkeleton = showSkeleton));
  }

  ngOnInit(): void {}

  onChangeCamera(deviceId: string): void {
    this.cameraService.changeCamera(deviceId);
  }

  onToggleSkeleton(): void {
    this.cameraService.toggleSkeleton(!this.showSkeleton);
  }
}
