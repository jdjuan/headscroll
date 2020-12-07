import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as tmPose from '@teachablemachine/pose';
import { Keypoint } from '@tensorflow-models/posenet';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { LayoutService } from './layout.service';

export enum Classes {
  Left = 'Left',
  Right = 'Right',
  Neutral = 'Neutral',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/metadata.json';
  readonly SCROLL_SPEED = 8;
  readonly SCROLL_SPEED_MOBILE_MULTIPLIER = 4;
  readonly FORECAST_CONFIDENCE = 0.95;
  readonly SCROLL_BUFFER = 200; // buffer added when the user reaches the iframe bottom
  readonly ZOOM_SPEED = 0.3;
  readonly DEFAULT_CAMERA_SIZE = 300;
  readonly SMALL_CAMERA_SIZE = 100;
  cameraSize = this.DEFAULT_CAMERA_SIZE;
  model: tmPose.CustomPoseNet;
  ctx: CanvasRenderingContext2D;
  maxPredictions: number;
  webcam: tmPose.Webcam;
  isLoadingCamera = true;
  forecast: Classes;
  source: SafeResourceUrl;
  iframeHeight = 1500; // initial iframe height
  zoomLevel = 1;
  availableCameras: MediaDeviceInfo[] = [];
  showSkeleton = true;
  unsubscribe = new Subject();
  isMobile: boolean;

  constructor(sanitizer: DomSanitizer, layoutService: LayoutService) {
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose
    this.source = sanitizer.bypassSecurityTrustResourceUrl(
      'https://tabs.ultimate-guitar.com/tab/foo-fighters/times-like-these-chords-1211863'
    );
    layoutService.isMobile.pipe(debounceTime(500), take(1)).subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
      if (isMobile) {
        this.cameraSize = this.SMALL_CAMERA_SIZE;
        this.showSkeleton = false;
      }
      this.init();
    });
  }

  async init(): Promise<void> {
    const deviceId = await this.getAvailableCameras();
    this.model = await tmPose.load(this.MODEL_URL, this.METADATA_URL);
    this.setCanvasContext();
    this.setupWebCam(deviceId);
  }

  async getAvailableCameras(): Promise<string> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    this.availableCameras = cameras;
    return cameras[0].deviceId;
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
      this.scrollDown();
    } else if (rightForecast.probability > this.FORECAST_CONFIDENCE) {
      this.scrollUp();
      this.forecast = Classes.Right;
    } else {
      this.forecast = Classes.Neutral;
    }
  }

  scrollDown(): void {
    const { scrollTop, scrollHeight, clientHeight } = this.iframeWrapper.nativeElement;
    const additionalBuffer = 200; // to avoid reaching the bottom
    const iframeHeight = scrollHeight - clientHeight - additionalBuffer;
    const currentScroll = scrollTop * this.zoomLevel; // current position accounting for the current scroll
    if (currentScroll >= iframeHeight) {
      this.iframeHeight += this.SCROLL_BUFFER;
    }
    this.performScroll(this.SCROLL_SPEED);
  }
  scrollUp(): void {
    this.performScroll(-this.SCROLL_SPEED);
  }

  performScroll(speed: number): void {
    if (this.isMobile) {
      speed *= this.SCROLL_SPEED_MOBILE_MULTIPLIER;
    }
    try {
      this.iframeWrapper.nativeElement.scrollBy({ top: speed, left: 0, behavior: 'smooth' });
    } catch (error) {
      this.iframeWrapper.nativeElement.scrollBy(0, speed);
    }
  }

  hasTiltedLeft(): boolean {
    return this.forecast === Classes.Left;
  }
  hasTiltedRight(): boolean {
    return this.forecast === Classes.Right;
  }

  zoomIn(): void {
    this.zoomLevel += this.ZOOM_SPEED;
  }
  zoomOut(): void {
    this.zoomLevel -= this.ZOOM_SPEED;
  }

  getZoom(): string {
    return `scale(${this.zoomLevel})`;
  }

  changeCamera(deviceId: string): void {
    this.setupWebCam(deviceId);
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
