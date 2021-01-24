import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private readonly PROXY_URL = 'https://api.codetabs.com/v1/headers/?domain=';
  private cachedUrls: Record<string, boolean> = {};

  constructor(private http: HttpClient) {}

  isEmbeddable(url: string): Observable<boolean> {
    if (this.cachedUrls[url]) {
      return of(this.cachedUrls[url]);
    }
    return this.canLoadInIframe(url);
  }

  private canLoadInIframe(url: string): Observable<boolean> {
    return this.http.get(this.PROXY_URL + url).pipe(
      map((responses: any[]) => {
        const isEmbeddable = !this.hasXFrameOptions(responses);
        this.cachedUrls[url] = isEmbeddable;
        return isEmbeddable;
      }),
      catchError(() => {
        this.cachedUrls[url] = false;
        return of(false);
      })
    );
  }

  private hasXFrameOptions = (responses: any): boolean => {
    if (responses.length === 0) {
      return false;
    }
    if (responses.Error) {
      return false;
    }
    return responses.some((res) => {
      if (res['x-frame-options'] || res['X-Frame-Options']) {
        return true;
      }
      return false;
    });
  }
}
