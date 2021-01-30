import { Component, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { Webcam, CustomPoseNet, load } from '@teachablemachine/pose';
import { CameraService } from '../../services/camera.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LARGE_BREAKPOINT } from 'src/app/core/constants';
import { ConfigService } from '../../services/config.service';
import { timer } from 'rxjs';

export enum Classes {
  Left = 'Left',
  Right = 'Right',
  Neutral = 'Neutral',
}

@UntilDestroy()
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  readonly MODEL_URL = 'assets/model.json';
  // readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/model.json';
  readonly METADATA_URL = 'assets/metadata.json';
  // readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/metadata.json';
  readonly DEFAULT_CAMERA_SIZE = 400;
  readonly SMALL_CAMERA_SIZE = 100;
  readonly FORECAST_CONFIDENCE = 0.95;
  readonly DEBOUNCE_PREDICTION_TIME = 100;

  @Output() scrolling = new EventEmitter<boolean>();
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  cameraSize = this.DEFAULT_CAMERA_SIZE;
  isLoadingCamera = true;
  isMobile: boolean;
  webcam: Webcam;
  model: CustomPoseNet;
  ctx: CanvasRenderingContext2D;

  constructor(private breakpointObserver: BreakpointObserver, private cameraService: CameraService, private configService: ConfigService) {
    this.isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
    this.cameraSize = this.isMobile ? this.SMALL_CAMERA_SIZE : this.cameraSize;
    this.cameraService.selectedCamera$.subscribe((deviceId) => {
      if (deviceId) {
        this.setupWebCam(deviceId);
      }
    });
  }
  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    const cameras = await this.cameraService.getAvailableCameras();
    if (cameras) {
      const [firstCamera] = cameras;
      const { deviceId } = firstCamera;
      this.model = await load(this.MODEL_URL, this.METADATA_URL);
      this.setupWebCam(deviceId);
    }
  }

  async setupWebCam(deviceId: string): Promise<void> {
    const flip = true;
    this.webcam = new Webcam(this.cameraSize, this.cameraSize, flip);
    try {
      await this.webcam.setup({ deviceId });
      this.isLoadingCamera = false;
      this.video.nativeElement.srcObject = this.webcam.webcam.srcObject;
      this.video.nativeElement.play();
    } catch (error) {
      console.log('Could not load the camera');
      console.log(error);
    }
  }

  startPredicting(): void {
    timer(0, this.DEBOUNCE_PREDICTION_TIME).subscribe(this.predict);
  }

  predict = async (): Promise<void> => {
    const { heatmapScores, offsets, displacementFwd, displacementBwd } = await this.model.estimatePoseOutputs(this.video.nativeElement);
    const posenetOutput = await this.model.poseOutputsToAray(heatmapScores, offsets, displacementFwd, displacementBwd);
    const output = await this.model.predict(posenetOutput);
    this.forecast(output);
  }

  forecast(output: { className: string; probability: number }[]): void {
    const leftForecast = output.find((entry) => entry.className === Classes.Left);
    const rightForecast = output.find((entry) => entry.className === Classes.Right);
    if (leftForecast.probability > this.FORECAST_CONFIDENCE) {
      this.scrolling.emit(false);
    } else if (rightForecast.probability > this.FORECAST_CONFIDENCE) {
      this.scrolling.emit(true);
    }
  }
}
