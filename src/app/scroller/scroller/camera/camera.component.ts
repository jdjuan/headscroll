import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import * as tmPose from '@teachablemachine/pose';
import { Keypoint } from '@tensorflow-models/posenet';

export enum Classes {
  Left = 'Left',
  Right = 'Right',
  Neutral = 'Neutral',
}

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

  @Input() set selectedDeviceId(deviceId: string) {
    this.setupWebCam(deviceId);
  }
  @Input() set mobile(isMobile: boolean) {
    this.isMobile = isMobile;
    this.init();
  }
  @Input() showSkeleton: boolean;
  @Input() availableCameras: MediaDeviceInfo[] = [];
  @Output() scrollDown = new EventEmitter();
  @Output() scrollUp = new EventEmitter();
  @ViewChild('canvas') canvas: ElementRef;
  isMobile: boolean;
  cameraSize = this.DEFAULT_CAMERA_SIZE;
  forecast: Classes;
  isLoadingCamera = true;
  webcam: tmPose.Webcam;
  model: tmPose.CustomPoseNet;
  ctx: CanvasRenderingContext2D;

  ngOnInit(): void {}

  async init(): Promise<void> {
    if (this.isMobile) {
      this.cameraSize = this.SMALL_CAMERA_SIZE;
      this.showSkeleton = false;
    }
    const deviceId = this.availableCameras[0].deviceId;
    this.model = await tmPose.load(this.MODEL_URL, this.METADATA_URL);
    this.setCanvasContext();
    this.setupWebCam(deviceId);
  }

  setCanvasContext(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d');
  }

  async setupWebCam(deviceId: string): Promise<void> {
    const flip = true;
    this.webcam = new tmPose.Webcam(this.cameraSize, this.cameraSize, flip);
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
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, this.ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, this.ctx);
      }
    }
  }
}
