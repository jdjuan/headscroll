import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as normalizeUrl from 'normalize-url';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private location: Location) {}

  normalizeUrl(url: string): string {
    return normalizeUrl(url, { forceHttps: true, stripWWW: false });
  }

  updateUrl(website: string): void {
    const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { website } }).toString();
    this.location.go(url);
  }
}
