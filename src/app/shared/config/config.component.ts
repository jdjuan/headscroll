import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy } from '@ngneat/until-destroy';
import { StateService } from 'src/app/core/services/state.service';
import { CameraService } from '../../core/services/camera.service';

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
      this.selectedCamera = state.selectedCameraId;
    });
    this.cameraService.getAvailableCameras().then((cameras) => {
      if (cameras?.length > 1) {
        this.cameras = cameras;
      }
    });
  }

  updateSpeed(): void {
    this.stateService.updateState({ speed: this.scrollSpeed });
  }

  updateCamera(selectedCameraId: string): void {
    this.stateService.updateState({ selectedCameraId });
  }

  updateDirection(orientation: boolean): void {
    this.stateService.updateState({ orientation });
  }
}
