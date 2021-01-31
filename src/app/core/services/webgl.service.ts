import { Injectable } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';

@Injectable({
  providedIn: 'root',
})
export class WebglService {
  constructor(private storeService: StoreService) {}

  detectWebGLContext(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      this.storeService.updateState({ webglStatus: WebglStatus.Supported });
    } else {
      this.storeService.updateState({ webglStatus: WebglStatus.NotSupported });
    }
  }
}
