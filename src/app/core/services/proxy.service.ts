import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CurrentWebsite } from 'src/app/core/models/current-website.model';
import { ErrorType } from 'src/app/core/models/error.model';
import { WhitelistItem } from 'src/app/core/models/whitelist.model';
import { proxyMock } from 'src/app/core/services/proxy.mock';
import { StoreService } from 'src/app/core/services/store.service';
import { UrlService } from 'src/app/core/services/url.service';

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private whitelistEndpoint = 'https://headscroll.io/api/domain/';
  private PROXY = 'https://headscroll.io/api/proxy/';

  constructor(private http: HttpClient, private storeService: StoreService, private urlService: UrlService) {}

  validateWebsite(website: string): Observable<boolean> {
    website = this.urlService.normalizeUrl(website);
    return this.storeService
      .select((state) => state.whitelist)
      .pipe(
        map((whitelist) => {
          const currentWebsite = this.getCurrentWebsite(website, whitelist);
          this.storeService.updateState({ currentWebsite });
          return true;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  fetchWhitelist(): Observable<WhitelistItem[]> {
    return this.http.get<WhitelistItem[]>(this.whitelistEndpoint).pipe(
      // return of(proxyMock).pipe(
      tap((whitelist) => {
        this.storeService.updateState({ whitelist });
      }),
      catchError(() => {
        this.storeService.dispatchError(ErrorType.WhitelistFetchError);
        return of([]);
      })
    );
  }

  getCurrentWebsite(website: string, whitelist: WhitelistItem[]): CurrentWebsite {
    const hostname = new URL(website).hostname;
    const { id } = whitelist.find((whitelistItem) => whitelistItem.domain === hostname);
    const path = website.slice(website.indexOf(hostname) + hostname.length, website.length);
    const proxyUrl = `${this.PROXY}${id}${path}`;
    return { id, website, proxyUrl };
  }
}
