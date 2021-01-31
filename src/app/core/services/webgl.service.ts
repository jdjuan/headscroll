import { Injectable } from '@angular/core';
import { StateService } from 'src/app/core/services/state.service';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';

@Injectable({
  providedIn: 'root',
})
export class WebglService {
  constructor(private stateService: StateService) {}

  detectWebGLContext(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      this.stateService.updateState({ webglStatus: WebglStatus.Supported });
    } else {
      this.stateService.updateState({ webglStatus: WebglStatus.NotSupported });
    }
  }
}
