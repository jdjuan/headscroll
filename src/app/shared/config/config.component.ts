import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StateService } from 'src/app/core/state.service';
import { CameraService } from '../../scroller/services/camera.service';

@UntilDestroy()
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  @ViewChild('reportTooltip') reportTooltip: NgbTooltip;
  isReportSent: boolean;
  orientation: boolean;
  scrollSpeed: number;
  cameras: MediaDeviceInfo[];
  selectedCamera: string;

  constructor(private cameraService: CameraService, private stateService: StateService) {}
  ngOnInit(): void {
    this.stateService.state$.subscribe((state) => {
      this.scrollSpeed = state.speed;
      this.orientation = state.orientation;
    });
    this.cameraService.getAvailableCameras().then((cameras) => {
      this.cameras = cameras;
    });
    this.cameraService.selectedCamera$.pipe(untilDestroyed(this)).subscribe((deviceId) => {
      this.selectedCamera = deviceId;
    });
  }

  updateSpeed(): void {
    this.stateService.updateState({ speed: this.scrollSpeed });
  }

  updateCamera(deviceId: string): void {
    this.cameraService.changeCamera(deviceId);
  }

  updateDirection(orientation: boolean): void {
    this.stateService.updateState({ orientation });
  }
}
