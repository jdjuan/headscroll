import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CameraService } from '../../services/camera.service';
import { ConfigService } from '../../services/config.service';

@UntilDestroy()
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  @ViewChild('reportTooltip') reportTooltip: NgbTooltip;
  isReportSent: boolean;
  direction: boolean;
  scrollSpeed: number;
  cameras: MediaDeviceInfo[];
  selectedCamera: string;

  constructor(private configService: ConfigService, private cameraService: CameraService) {}
  ngOnInit(): void {
    this.configService.scrollSpeed.pipe(untilDestroyed(this)).subscribe((speed) => {
      this.scrollSpeed = speed;
    });
    this.configService.orientation$.pipe(untilDestroyed(this)).subscribe((direction) => {
      this.direction = direction;
    });
    this.cameraService.getAvailableCameras().then((cameras) => {
      this.cameras = cameras;
    });
    this.cameraService.selectedCamera$.pipe(untilDestroyed(this)).subscribe((deviceId) => {
      this.selectedCamera = deviceId;
    });
  }

  updateSpeed(): void {
    this.configService.changeSpeed(this.scrollSpeed);
  }

  updateCamera(deviceId: string): void {
    this.cameraService.changeCamera(deviceId);
  }

  updateDirection(direction: boolean): void {
    this.configService.changeOrientation(direction);
  }

  sendReport(): void {
    this.reportTooltip.open();
    this.isReportSent = true;
    this.configService.currentWebsite$.pipe(untilDestroyed(this)).subscribe(console.log);
    setTimeout(() => {
      this.isReportSent = false;
    }, 4000);
  }
}
