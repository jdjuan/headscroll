import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as tmPose from '@teachablemachine/pose';
import { Keypoint } from '@tensorflow-models/posenet';

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
export class AppComponent {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/metadata.json';
  readonly CAMERA_SIZE = 300;
  readonly SCROLL_SPEED = 7;
  readonly FORECAST_CONFIDENCE = 0.95;
  readonly SCROLL_BUFFER = 1.5;
  readonly ZOOM_SPEED = 0.1;
  model: tmPose.CustomPoseNet;
  ctx: CanvasRenderingContext2D;
  maxPredictions: number;
  webcam: tmPose.Webcam;
  isLoadingCamera = true;
  forecast: Classes;
  source: SafeResourceUrl;
  iframeHeight = 100;
  zoomLevel = 1;
  availableCameras: MediaDeviceInfo[] = [];
  selectedCamera: string;

  constructor(sanitizer: DomSanitizer) {
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose
    this.init();
    this.source = sanitizer.bypassSecurityTrustResourceUrl(
      'https://tabs.ultimate-guitar.com/tab/foo-fighters/times-like-these-chords-1211863'
    );
  }

  async init(): Promise<void> {
    const deviceId = await this.getAvailableCameras();
    console.log(deviceId);
    this.model = await tmPose.load(this.MODEL_URL, this.METADATA_URL);
    this.setCanvasContext();
    this.setupWebCam(deviceId);
  }

  async getAvailableCameras(): Promise<string> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    this.availableCameras = cameras;
    this.selectedCamera = cameras[0].deviceId;
    return this.selectedCamera;
  }

  setCanvasContext(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d');
  }

  async setupWebCam(deviceId: string): Promise<void> {
    const flip = true;
    this.webcam = new tmPose.Webcam(this.CAMERA_SIZE, this.CAMERA_SIZE, flip);
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
    const height = scrollHeight - clientHeight;
    if (height === scrollTop) {
      this.iframeHeight *= this.SCROLL_BUFFER;
    }
    this.iframeWrapper.nativeElement.scrollBy(0, this.SCROLL_SPEED);
  }
  scrollUp(): void {
    this.iframeWrapper.nativeElement.scrollBy(0, -this.SCROLL_SPEED);
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

  changeCamera(): void {
    this.setupWebCam(this.selectedCamera);
  }

  drawPose(pose: { keypoints: Keypoint[] }): void {
    if (this.webcam.canvas) {
      this.ctx.drawImage(this.webcam.canvas, 0, 0);
      if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, this.ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, this.ctx);
      }
    }
  }
}
