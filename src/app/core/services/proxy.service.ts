import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DomainState } from 'src/app/core/models/domain-state.enum';
import { ErrorType } from 'src/app/core/models/error.model';
import { ProxyResponse } from 'src/app/core/models/proxy-response.model';
import { allDomains } from 'src/app/core/services/proxy.mock';
import { StoreService } from 'src/app/core/services/store.service';
import { UrlService } from 'src/app/core/services/url.service';

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private proxyEndpoint = 'https://headscroll.io/api/domain/';
  private readonly PROXY_BASE_URL = 'https://headscroll.io';

  constructor(private http: HttpClient, private storeService: StoreService, private urlService: UrlService) {}

  validateWebsite(website: string): Observable<boolean> {
    website = this.urlService.normalizeUrl(website);
    return this.fetchProxyResponse(website).pipe(
      map(({ id, proxyUrl }) => {
        this.storeService.updateState({ currentWebsite: { id, website, proxyUrl } });
        return true;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  fetchProxyResponse(url: string): Observable<ProxyResponse> {
    return (
      this.mockResponse(url)
        // return this.http
        //   .post<ProxyResponse>(this.proxyEndpoint, { url })
        .pipe(
          map((proxyResponse) => {
            if (proxyResponse.state === DomainState.Denied) {
              throw null;
            } else {
              proxyResponse.proxyUrl = this.PROXY_BASE_URL + proxyResponse.proxyUrl;
              this.storeService.updateState({ proxyResponse });
              return proxyResponse;
            }
          }),
          catchError(() => {
            this.storeService.dispatchError(ErrorType.ProxyFetchError);
            return of(null);
          })
        )
    );
  }

  mockResponse(url: string): Observable<ProxyResponse> {
    const website = new URL(url);
    const path = url.split(website.hostname)[1];
    const response = allDomains.find((domain) => {
      return domain.domain === website.hostname;
    });
    if (!response) {
      throw null;
    }
    response.proxyUrl = `/api/proxy/${response.id}/${path}`;

    return of(response);
  }
}
