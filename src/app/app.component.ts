import { Component } from '@angular/core';
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
  title = 'scroll-wtih-head';
  model: tmPose.CustomPoseNet;
  webcam: tmPose.Webcam;
  ctx: CanvasRenderingContext2D;
  labelContainer: HTMLElement;
  maxPredictions: number;
  size = 600;
  url = 'https://teachablemachine.withgoogle.com/models/l5fbLAKJu/';
  forecast: Classes;
  classes = Classes;

  constructor() {
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

    // the link to your model provided by Teachable Machine export panel
    this.init();
  }

  scrollDown() {
    document.getElementById('iframe-wrapper').scrollBy(0, 7);
  }
  scrollUp() {
    document.getElementById('iframe-wrapper').scrollBy(0, -7);
  }

  async init() {
    const modelURL = this.url + 'model.json';
    const metadataURL = this.url + 'metadata.json';
    this.model = await tmPose.load(modelURL, metadataURL);
    this.maxPredictions = this.model.getTotalClasses();
    this.setupWebCam();
    // append/get elements to the DOM
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = this.size;
    canvas.height = this.size;
    this.ctx = canvas.getContext('2d');
    this.labelContainer = document.getElementById('label-container');
    for (let i = 0; i < this.maxPredictions; i++) {
      this.labelContainer.appendChild(document.createElement('div'));
    }
  }

  async setupWebCam() {
    const flip = true; // whether to flip the webcam
    this.webcam = new tmPose.Webcam(this.size, this.size, flip); // width, height, flip
    await this.webcam.setup(); // request access to the webcam
    await this.webcam.play();
    window.requestAnimationFrame(this.loop);
  }

  loop = async (timestamp: any) => {
    this.webcam.update(); // update the webcam frame
    await this.predict();
    window.requestAnimationFrame(this.loop);
  }

  async predict() {
    const { pose, posenetOutput } = await this.model.estimatePose(
      this.webcam.canvas
    );
    const prediction = await this.model.predict(posenetOutput);
    this.mapPrediction(prediction);
    this.drawPose(pose);
  }

  mapPrediction(
    groups: {
      className: string;
      probability: number;
    }[]
  ): void {
    const left = groups.find((group) => group.className === Classes.Left);
    const right = groups.find((group) => group.className === Classes.Right);
    if (left.probability > 0.95) {
      this.forecast = Classes.Left;
      this.scrollDown();
    } else if (right.probability > 0.95) {
      this.scrollUp();
      this.forecast = Classes.Right;
    } else {
      this.forecast = Classes.Neutral;
    }
  }

  drawPose(pose: { keypoints: Keypoint[] }) {
    if (this.webcam.canvas) {
      this.ctx.drawImage(this.webcam.canvas, 0, 0);
      // draw the keypoints and skeleton
      if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, this.ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, this.ctx);
      }
    }
  }
}
