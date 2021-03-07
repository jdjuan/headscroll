import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BetaTestGuard implements CanActivate, CanActivateChild {
  constructor(private httpClient: HttpClient) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    _: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const betaKey = childRoute.queryParams['betaKey'];
    console.log({ betaKey });
    return this.hasAccess(betaKey);
  }
  canActivate(next: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const betaKey = next.queryParams['betaKey'];
    console.log({ betaKey });
    return this.hasAccess(betaKey);
  }

  private hasAccess(key: string) {
    return this.httpClient
      .get<{ authorized: boolean }>('./api/authorization', { params: new HttpParams().set('key', key) })
      .pipe(map((r) => r.authorized));
  }
}
