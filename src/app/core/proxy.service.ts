import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError, pluck, switchMap } from 'rxjs/operators';

interface ProxyResponse {
  isEmbeddable: boolean;
  websiteUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private readonly PROXY_URL = 'https://api.codetabs.com/v1/headers/?domain=';

  constructor(private http: HttpClient) {}

  getWebsiteUrl(params: Observable<Params>): Observable<ProxyResponse> {
    return params.pipe(pluck('website'), switchMap(this.verifyWithProxy));
  }

  verifyWithProxy = (websiteUrl: string): Observable<ProxyResponse> => {
    console.log({ websiteUrl });
    return this.http.get(this.PROXY_URL + websiteUrl).pipe(
      map((responses: any[]) => {
        const isEmbeddable = this.isEmbeddable(responses);
        return { isEmbeddable, websiteUrl } as ProxyResponse;
      }),
      catchError(() => of({ isEmbeddable: false, websiteUrl } as ProxyResponse))
    );
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
