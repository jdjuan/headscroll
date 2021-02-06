import { Injectable } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebglService {
  constructor(private storeService: StoreService) {}

  detectWebGLContext(): Observable<void> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const extensions = (gl as any)?.getSupportedExtensions() as string[];
    return this.storeService.state$.pipe(
      take(1),
      map(({ isMobile }) => {
        if (isMobile) {
          this.storeService.updateState({ webglStatus: WebglStatus.Supported });
        } else if (gl && gl instanceof WebGLRenderingContext && extensions.includes('EXT_sRGB')) {
          this.storeService.updateState({ webglStatus: WebglStatus.Supported });
        } else {
          this.storeService.updateState({ webglStatus: WebglStatus.NotSupported });
        }
      })
    );
  }
}
