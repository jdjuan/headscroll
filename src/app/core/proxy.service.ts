import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateService } from 'src/app/core/state.service';
import { UrlService } from 'src/app/core/url.service';

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private readonly TIMEOUT = 9000;
  private cachedUrls: Record<string, boolean> = {};

  constructor(private http: HttpClient, private stateService: StateService, private urlService: UrlService) {}

  validateWebsite(website: string): boolean {
    website = this.urlService.normalizeUrl(website);
    // Check if it is whitelisted
    if (website) {
      return true;
    } else {
      return false;
    }
  }

  // isEmbeddable(url: string): Observable<boolean> {
  //   if (this.cachedUrls[url]) {
  //     return of(this.cachedUrls[url]);
  //   }
  //   return this.canLoadInIframe(url);
  // }

  // private canLoadInIframe(url: string): Observable<boolean> {
  //   return this.http.get(this.PROXY_URL + url).pipe(
  //     map((responses: any[]) => {
  //       const isEmbeddable = !this.hasXFrameOptions(responses);
  //       this.cachedUrls[url] = isEmbeddable;
  //       return isEmbeddable;
  //     }),
  //     timeout(this.TIMEOUT),
  //     catchError(({ name: type }: { name: ErrorType }) => {
  //       this.stateService.updateState({ error: { type, message: ErrorMessages[type] } });
  //       this.cachedUrls[url] = false;
  //       return of(false);
  //     })
  //   );
  // }

  // private hasXFrameOptions = (responses: any): boolean => {
  //   return responses.some((res) => {
  //     if (res['x-frame-options'] || res['X-Frame-Options']) {
  //       return true;
  //     }
  //     return false;
  //   });
  // };
}
