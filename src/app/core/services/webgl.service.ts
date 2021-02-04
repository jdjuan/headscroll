import { Injectable } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';

@Injectable({
  providedIn: 'root',
})
export class WebglService {
  private readonly WEBGL_EXTENSIONS = ['WEBGL_compressed_texture_s3tc_srgb', 'EXT_shader_texture_lod', 'EXT_frag_depth', 'EXT_sRGB'];

  constructor(private storeService: StoreService) {}

  detectWebGLContext(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const extensions = (gl as any)?.getSupportedExtensions() as string[];

    if (gl && gl instanceof WebGLRenderingContext && extensions.includes(this.WEBGL_EXTENSIONS[0])) {
      this.storeService.updateState({ webglStatus: WebglStatus.Supported });
    } else {
      this.storeService.updateState({ webglStatus: WebglStatus.NotSupported });
    }
  }
}
