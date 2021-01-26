import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
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
export class CameraComponent {
  readonly MODEL_URL = 'assets/model.json';
  // readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/model.json';
  readonly METADATA_URL = 'assets/metadata.json';
  // readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/metadata.json';
  readonly DEFAULT_CAMERA_SIZE = 400;
  readonly SMALL_CAMERA_SIZE = 100;
  readonly FORECAST_CONFIDENCE = 0.95;
  readonly DEBOUNCE_PREDICTION_TIME = 100;

  @Output() scrollDown = new EventEmitter();
  @Output() scrollUp = new EventEmitter();
  @Output() cameraLoaded = new EventEmitter();
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  cameraSize = this.DEFAULT_CAMERA_SIZE;
  isLoadingCamera = true;
  isMobile: boolean;
  forecast: Classes;
  webcam: Webcam;
  model: CustomPoseNet;
  ctx: CanvasRenderingContext2D;
  direction: boolean;

  constructor(private breakpointObserver: BreakpointObserver, private cameraService: CameraService, private configService: ConfigService) {
    this.isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
    this.cameraService.getAvailableCameras().then((cameras) => {
      const [firstCamera] = cameras;
      const { deviceId } = firstCamera;
      this.init(deviceId);
    });
    this.cameraService.selectedCamera$.subscribe((deviceId) => {
      if (deviceId) {
        this.setupWebCam(deviceId);
      }
    });
    this.configService.direction$.subscribe((direction) => {
      this.direction = direction;
    });
  }

  async init(deviceId: string): Promise<void> {
    if (this.isMobile) {
      this.cameraSize = this.SMALL_CAMERA_SIZE;
    }
    this.model = await load(this.MODEL_URL, this.METADATA_URL);
    this.setupWebCam(deviceId);
  }

  async setupWebCam(deviceId: string): Promise<void> {
    const flip = true;
    this.webcam = new Webcam(this.cameraSize, this.cameraSize, flip);
    try {
      await this.webcam.setup({ deviceId });
      this.isLoadingCamera = false;
      this.cameraLoaded.next();
      this.video.nativeElement.srcObject = this.webcam.webcam.srcObject;
      this.video.nativeElement.play();
    } catch (error) {
      console.log('Could not load the camera');
      console.log(error);
    }
  }

  startPredicting(): void{
    timer(0, this.DEBOUNCE_PREDICTION_TIME).subscribe(this.predict);
  }

  predict = async (): Promise<void> => {
    const { heatmapScores, offsets, displacementFwd, displacementBwd } = await this.model.estimatePoseOutputs(this.video.nativeElement);
    const posenetOutput = await this.model.poseOutputsToAray(heatmapScores, offsets, displacementFwd, displacementBwd);
    const output = await this.model.predict(posenetOutput);
    this.getForecast(output);
  }

  getForecast(output: { className: string; probability: number }[]): void {
    const leftForecast = output.find((entry) => entry.className === Classes.Left);
    const rightForecast = output.find((entry) => entry.className === Classes.Right);
    if (leftForecast.probability > this.FORECAST_CONFIDENCE) {
      this.forecast = Classes.Left;
      if (this.direction) {
        this.scrollDown.emit();
      } else {
        this.scrollUp.emit();
      }
    } else if (rightForecast.probability > this.FORECAST_CONFIDENCE) {
      this.forecast = Classes.Right;
      if (this.direction) {
        this.scrollUp.emit();
      } else {
        this.scrollDown.emit();
      }
    } else {
      this.forecast = Classes.Neutral;
    }
  }

  hasTiltedLeft(): boolean {
    return this.forecast === Classes.Left;
  }
  hasTiltedRight(): boolean {
    return this.forecast === Classes.Right;
  }
}
