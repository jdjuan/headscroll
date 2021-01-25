import { Injectable } from '@angular/core';
import * as normalizeUrl from 'normalize-url';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor() {}

  normalizeUrl(url: string): string {
    return normalizeUrl(url, { forceHttps: true, stripWWW: false });
  }
}
