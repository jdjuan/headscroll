import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CameraService } from '../../services/camera.service';
import { ConfigService } from '../../services/config.service';

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

  constructor(private configService: ConfigService, private cameraService: CameraService) {

    this.configService.scrollSpeed.subscribe((speed) => {
      this.scrollSpeed = speed;
    });
    this.configService.direction$.subscribe((direction) => {
      this.direction = direction;
    });
    this.cameraService.getAvailableCameras().then((cameras) => {
      this.cameras = cameras;
    });
  }
  ngOnInit(): void {}

  updateSpeed(): void {
    this.configService.changeSpeed(this.scrollSpeed);
  }

  updateCamera(deviceId: string): void {
    this.cameraService.changeCamera(deviceId);
  }

  updateDirection(direction: boolean): void {
    this.configService.changeDirection(direction);
  }

  sendReport(): void {
    this.reportTooltip.open();
    this.isReportSent = true;
    this.configService.currentWebsite$.subscribe(console.log);
  }
}
