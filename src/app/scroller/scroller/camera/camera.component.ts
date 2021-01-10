import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Webcam, CustomPoseNet, load, drawKeypoints, drawSkeleton } from '@teachablemachine/pose';
import { Keypoint } from '@tensorflow-models/posenet';
import { CameraService } from '../../services/camera.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LARGE_BREAKPOINT } from 'src/app/core/constants';
import { ConfigService } from '../../services/config.service';

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
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/metadata.json';
  readonly DEFAULT_CAMERA_SIZE = 400;
  readonly SMALL_CAMERA_SIZE = 100;
  readonly FORECAST_CONFIDENCE = 0.95;

  @Output() scrollDown = new EventEmitter();
  @Output() scrollUp = new EventEmitter();
  @Output() cameraLoaded = new EventEmitter();
  @ViewChild('canvas') canvas: ElementRef;
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
      this.setupWebCam(deviceId);
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
    try {
      await this.webcam.setup({ deviceId });
      await this.webcam.play();
      window.requestAnimationFrame(this.loop);
      this.isLoadingCamera = false;
      this.cameraLoaded.next();
    } catch (error) {
      console.log('Could not load the camera');
      console.log(error);
    }
  }

  loop = async (timestamp: any) => {
    this.webcam.update();
    if (this.webcam.canvas) {
      await this.predict();
    }
    window.requestAnimationFrame(this.loop);
  }

  async predict(): Promise<void> {
    const { pose, posenetOutput } = await this.model.estimatePose(this.webcam.canvas);
    const output = await this.model.predict(posenetOutput);
    this.getForecast(output);
    this.drawPose(pose);
  }

  getForecast(output: { className: string; probability: number }[]): void {
    const leftForecast = output.find((entry) => entry.className === Classes.Left);
    const rightForecast = output.find((entry) => entry.className === Classes.Right);
    if (leftForecast.probability > this.FORECAST_CONFIDENCE) {
      this.forecast = Classes.Left;
      if (this.direction) {
        this.scrollUp.emit();
      } else {
        this.scrollDown.emit();
      }
    } else if (rightForecast.probability > this.FORECAST_CONFIDENCE) {
      this.forecast = Classes.Right;
      if (this.direction) {
        this.scrollDown.emit();
      } else {
        this.scrollUp.emit();
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

  drawPose(pose: { keypoints: Keypoint[] }): void {
    if (this.webcam.canvas) {
      this.ctx.drawImage(this.webcam.canvas, 0, 0);
      // if (pose) {
      //   const minPartConfidence = 0.5;
      //   drawKeypoints(pose.keypoints, minPartConfidence, this.ctx);
      //   drawSkeleton(pose.keypoints, minPartConfidence, this.ctx);
      // }
    }
  }
}
