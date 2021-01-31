import { Component, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { Webcam, CustomPoseNet, load } from '@teachablemachine/pose';
import { CameraService } from '../../../core/services/camera.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LARGE_BREAKPOINT } from 'src/app/core/models/constants';
import { timer } from 'rxjs';
import { StateService } from 'src/app/core/services/state.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorType } from 'src/app/core/models/error.model';

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
  // source: MediaProvider;
  model: CustomPoseNet;
  onCameraChange$ = new Subject();

  constructor(private breakpointObserver: BreakpointObserver, private cameraService: CameraService, private stateService: StateService) {
    this.stateService
      .select<string>((state) => state.selectedCameraId)
      .subscribe((selectedCameraId) => {
        this.onCameraChange$.next();
        this.setupWebcam(selectedCameraId);
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
      this.stateService.dispatchError(ErrorType.CameraNotLoaded);
      console.log('Could not load the camera');
      console.log(error);
    }
  }

  startPredicting(): void {
    timer(0, this.DEBOUNCE_PREDICTION_TIME).pipe(takeUntil(this.onCameraChange$)).subscribe(this.predict);
  }

  predict = async (): Promise<void> => {
    const { heatmapScores, offsets, displacementFwd, displacementBwd } = await this.model.estimatePoseOutputs(this.video.nativeElement);
    const posenetOutput = await this.model.poseOutputsToAray(heatmapScores, offsets, displacementFwd, displacementBwd);
    const output = await this.model.predict(posenetOutput);
    this.forecast(output);
  }

  forecast(output: { className: string; probability: number }[]): void {
    const [LEFT, RIGHT] = ['Left', 'Right'];
    const FORECAST_CONFIDENCE = 0.95;
    const leftForecast = output.find((entry) => entry.className === LEFT);
    const rightForecast = output.find((entry) => entry.className === RIGHT);
    if (leftForecast.probability > FORECAST_CONFIDENCE) {
      this.scrolling.emit(false);
    } else if (rightForecast.probability > FORECAST_CONFIDENCE) {
      this.scrolling.emit(true);
    }
  }
}
