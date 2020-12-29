import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Webcam, CustomPoseNet, load, drawKeypoints, drawSkeleton } from '@teachablemachine/pose';
import { Keypoint } from '@tensorflow-models/posenet';
import { LayoutService } from '../../services/layout.service';
import { CameraService } from '../../services/camera.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/metadata.json';
  readonly DEFAULT_CAMERA_SIZE = 300;
  readonly SMALL_CAMERA_SIZE = 100;
  readonly FORECAST_CONFIDENCE = 0.95;

  @Output() scrollDown = new EventEmitter();
  @Output() scrollUp = new EventEmitter();
  @ViewChild('canvas') canvas: ElementRef;
  cameraSize = this.DEFAULT_CAMERA_SIZE;
  isLoadingCamera = true;
  showSkeleton: boolean;
  isMobile: boolean;
  forecast: Classes;
  webcam: Webcam;
  model: CustomPoseNet;
  ctx: CanvasRenderingContext2D;

  constructor(layoutService: LayoutService, cameraService: CameraService) {
    const cameras$ = cameraService.getAvailableCameras();
    const isMobile$ = layoutService.isMobileOnce$.toPromise();
    Promise.all([cameras$, isMobile$]).then(([cameras, isMobile]) => {
      const [firstCamera] = cameras;
      const { deviceId } = firstCamera;
      this.isMobile = isMobile;
      this.init(deviceId);
    });
    cameraService.selectedCamera$.pipe(untilDestroyed(this)).subscribe((deviceId) => {
      this.setupWebCam(deviceId);
    });
    cameraService.showSkeleton$.pipe(untilDestroyed(this)).subscribe((showSkeleton) => {
      this.showSkeleton = showSkeleton;
    });
  }

  ngOnInit(): void {}

  async init(deviceId: string): Promise<void> {
    if (this.isMobile) {
      this.cameraSize = this.SMALL_CAMERA_SIZE;
      this.showSkeleton = false;
    }
    this.model = await load(this.MODEL_URL, this.METADATA_URL);
    this.setCanvasContext();
    this.setupWebCam(deviceId);
  }

  setCanvasContext(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d');
  }

  async setupWebCam(deviceId: string): Promise<void> {
    const flip = true;
    this.webcam = new Webcam(this.cameraSize, this.cameraSize, flip);
    await this.webcam.setup({ deviceId });
    await this.webcam.play();
    window.requestAnimationFrame(this.loop);
    this.isLoadingCamera = false;
  }

  loop = async (timestamp: any) => {
    this.webcam.update();
    await this.predict();
    window.requestAnimationFrame(this.loop);
  }

  async predict(): Promise<void> {
    if (this.webcam) {
      const { pose, posenetOutput } = await this.model.estimatePose(this.webcam.canvas);
      const output = await this.model.predict(posenetOutput);
      this.getForecast(output);
      this.drawPose(pose);
    }
  }

  getForecast(output: { className: string; probability: number }[]): void {
    const leftForecast = output.find((entry) => entry.className === Classes.Left);
    const rightForecast = output.find((entry) => entry.className === Classes.Right);
    if (leftForecast.probability > this.FORECAST_CONFIDENCE) {
      this.forecast = Classes.Left;
      this.scrollDown.emit();
    } else if (rightForecast.probability > this.FORECAST_CONFIDENCE) {
      this.forecast = Classes.Right;
      this.scrollUp.emit();
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

  drawPose(pose: { keypoints: Keypoint[] }): void {
    if (this.webcam.canvas) {
      this.ctx.drawImage(this.webcam.canvas, 0, 0);
      if (pose && this.showSkeleton) {
        const minPartConfidence = 0.5;
        drawKeypoints(pose.keypoints, minPartConfidence, this.ctx);
        drawSkeleton(pose.keypoints, minPartConfidence, this.ctx);
      }
    }
  }
}
