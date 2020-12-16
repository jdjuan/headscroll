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
  proxyUrl = 'https://api.codetabs.com/v1/headers/?domain=';

  constructor(private http: HttpClient) {}

  getWebsiteUrl(params: Observable<Params>): Observable<ProxyResponse> {
    return params.pipe(pluck('website'), switchMap(this.verifyWithProxy));
  }

  verifyWithProxy = (websiteUrl: string) => {
    console.log({ websiteUrl });

    return this.http.get(this.proxyUrl + websiteUrl).pipe(
      map((responses: any[]) => {
        const isEmbeddable = this.isEmbeddable(responses);
        return { isEmbeddable, websiteUrl } as ProxyResponse;
      }),
      catchError(() => of({ isEmbeddable: true, websiteUrl } as ProxyResponse))
    );
  }

  isEmbeddable = (responses: any[]): boolean => {
    if (responses.length === 0) {
      return true;
    }
    return responses.some((res) => !res['x-frame-options']);
  }
}
