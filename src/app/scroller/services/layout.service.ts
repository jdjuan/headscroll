import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isMobile$: Observable<boolean>;
  isMobileOnce$: Observable<boolean>;

  constructor(breakpointObserver: BreakpointObserver) {
    this.isMobile$ = breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(map((result) => result.matches));
    this.isMobileOnce$ = this.isMobile$.pipe(take(1));
  }
}
