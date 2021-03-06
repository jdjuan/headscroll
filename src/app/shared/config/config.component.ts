import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraService } from '@core/services/camera.service';
import { StoreService } from '@core/services/store.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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

  constructor(private cameraService: CameraService, private storeService: StoreService) {}
  ngOnInit(): void {
    this.storeService.state$.pipe(untilDestroyed(this)).subscribe((state) => {
      this.scrollSpeed = state.speed;
      this.orientation = state.orientation;
      this.selectedCamera = state.selectedCamera?.id;
    });
    this.cameraService.getAvailableCameras().then((cameras) => {
      if (cameras?.length > 1) {
        this.cameras = cameras;
      }
    });
  }

  updateSpeed(): void {
    this.storeService.updateState({ speed: this.scrollSpeed });
  }

  updateCamera(selectedCameraId: string): void {
    this.storeService.updateState({ selectedCamera: { id: selectedCameraId } });
  }

  updateDirection(orientation: boolean): void {
    this.storeService.updateState({ orientation });
  }
}
