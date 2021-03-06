import { Component, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { Webcam, CustomPoseNet, load } from '@teachablemachine/pose';
import { CameraService } from '../../../core/services/camera.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LARGE_BREAKPOINT } from 'src/app/core/models/constants';
import { timer } from 'rxjs';
import { StoreService } from 'src/app/core/services/store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorType } from 'src/app/core/models/error.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @Output() scrolling = new EventEmitter<boolean>();
  readonly DEBOUNCE_PREDICTION_TIME = 100;
  readonly FORECAST_CONFIDENCE = 0.99;
  isCameraReady = false;
  // source: MediaProvider;
  model: CustomPoseNet;
  onCameraChange$ = new Subject();

  constructor(private breakpointObserver: BreakpointObserver, private cameraService: CameraService, private storeService: StoreService) {
    this.storeService
      .select<{ id: string }>((state) => state.selectedCamera)
      .pipe(untilDestroyed(this))
      .subscribe(({ id }) => {
        this.onCameraChange$.next();
        this.isCameraReady = false;
        this.setupWebcam(id);
      });
  }
  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    const [MODEL_URL, METADATA_URL] = ['assets/model.json', 'assets/metadata.json'];
    const cameras = await this.cameraService.getAvailableCameras();
    if (cameras) {
      const [firstCamera] = cameras;
      const { deviceId } = firstCamera;
      this.model = await load(MODEL_URL, METADATA_URL);
      this.setupWebcam(deviceId);
    }
  }

  setupWebcam = async (deviceId: string): Promise<void> => {
    try {
      const isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
      const DEFAULT_CAMERA_SIZE = 400;
      const SMALL_CAMERA_SIZE = 100;
      const cameraSize = isMobile ? SMALL_CAMERA_SIZE : DEFAULT_CAMERA_SIZE;
      const webcam = new Webcam(cameraSize, cameraSize);
      await webcam.setup({ deviceId });
      this.video.nativeElement.srcObject = webcam.webcam.srcObject;
      this.video.nativeElement.play();
    } catch (error) {
      this.storeService.dispatchError(ErrorType.CameraNotLoaded);
    }
  }

  startPredicting(): void {
    this.isCameraReady = true;
    timer(0, this.DEBOUNCE_PREDICTION_TIME).pipe(takeUntil(this.onCameraChange$), untilDestroyed(this)).subscribe(this.predict);
  }

  predict = async (): Promise<void> => {
    const { heatmapScores, offsets, displacementFwd, displacementBwd } = await this.model.estimatePoseOutputs(this.video.nativeElement);
    const posenetOutput = await this.model.poseOutputsToAray(heatmapScores, offsets, displacementFwd, displacementBwd);
    const output = await this.model.predict(posenetOutput);
    this.forecast(output);
  }

  forecast(output: { className: string; probability: number }[]): void {
    const [LEFT, RIGHT] = ['Left', 'Right'];
    const leftForecast = output.find((entry) => entry.className === LEFT);
    const rightForecast = output.find((entry) => entry.className === RIGHT);
    if (leftForecast.probability > this.FORECAST_CONFIDENCE) {
      this.scrolling.emit(false);
    } else if (rightForecast.probability > this.FORECAST_CONFIDENCE) {
      this.scrolling.emit(true);
    }
  }
}
