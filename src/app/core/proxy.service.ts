import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError, pluck, switchMap, tap } from 'rxjs/operators';

interface ProxyResponse {
  isEmbeddable: boolean;
  websiteUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private readonly PROXY_URL = 'https://api.codetabs.com/v1/headers/?domain=';
  private websitesAttempted: Record<string, boolean> = {};

  constructor(private http: HttpClient, private router: Router) {}

  getWebsiteUrl(params: Observable<Params>): Observable<ProxyResponse> {
    return params.pipe(pluck('website'), tap(this.validateWebsite), switchMap(this.verifyWithProxy));
  }

  verifyWithProxy = (websiteUrl: string): Observable<ProxyResponse> => {
    console.log({ websiteUrl });
    if (this.websitesAttempted[websiteUrl]) {
      return of({ isEmbeddable: true, websiteUrl } as ProxyResponse);
    }
    console.log('REQUEST ATTEMPTED');
    return this.http.get(this.PROXY_URL + websiteUrl).pipe(
      map((responses: any[]) => {
        const isEmbeddable = this.isEmbeddable(responses);
        this.websitesAttempted[websiteUrl] = true;
        return { isEmbeddable, websiteUrl } as ProxyResponse;
      }),
      catchError(() => {
        this.websitesAttempted[websiteUrl] = false;
        return of({ isEmbeddable: false, websiteUrl } as ProxyResponse);
      })
    );
  }

  validateWebsite = (websiteUrl) => {
    if (!websiteUrl) {
      this.router.navigate(['/'], { queryParams: { error: 'No website provided' } });
    } else if (this.websitesAttempted[websiteUrl] === false) {
      this.router.navigate(['/'], { queryParams: { error: 'Website can not be displayed' } });
    }
  }

  private isEmbeddable = (responses: any): boolean => {
    if (responses.length === 0) {
      return true;
    }
    if (responses.Error) {
      return false;
    }
    return responses.some((res) => {
      if (res['x-frame-options'] || res['X-Frame-Options']) {
        return false;
      }
      return true;
    });
  }
}
