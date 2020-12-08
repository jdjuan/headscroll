import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { LayoutService } from './../services/layout.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
})
export class ScrollerComponent {
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly SCROLL_SPEED = 11;
  readonly SCROLL_SPEED_MOBILE_MULTIPLIER = 4;
  readonly SCROLL_BUFFER = 200; // buffer added when the user reaches the iframe bottom
  readonly ZOOM_SPEED = 0.3;
  websiteTest = 'https://tabs.ultimate-guitar.com/tab/avi-kaplan/change-on-the-rise-chords-2691219';
  website: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  iframeHeight = 1500; // initial iframe height
  zoomLevel = 1;
  isMobile: boolean;

  constructor(public sanitizer: DomSanitizer, layoutService: LayoutService, activatedRoute: ActivatedRoute) {
    activatedRoute.params.pipe(pluck('website'), untilDestroyed(this)).subscribe((website: string) => {
      this.website = this.sanitizer.bypassSecurityTrustResourceUrl(website);
    });
    layoutService.isMobileOnce$.subscribe((isMobile) => (this.isMobile = isMobile));
  }

  renderWebsite(website: string): void {
    this.website = this.sanitizer.bypassSecurityTrustResourceUrl(website);
  }

  scrollDown(): void {
    const { scrollTop, scrollHeight, clientHeight } = this.iframeWrapper.nativeElement;
    const additionalBuffer = 200; // to avoid reaching the bottom
    const iframeHeight = scrollHeight - clientHeight - additionalBuffer;
    const currentScroll = scrollTop * this.zoomLevel; // current position accounting for the current scroll
    if (currentScroll >= iframeHeight) {
      this.iframeHeight += this.SCROLL_BUFFER;
    }
    this.performScroll(this.SCROLL_SPEED);
  }
  scrollUp(): void {
    this.performScroll(-this.SCROLL_SPEED);
  }

  performScroll(speed: number): void {
    if (this.isMobile) {
      speed *= this.SCROLL_SPEED_MOBILE_MULTIPLIER;
    }
    try {
      this.iframeWrapper.nativeElement.scrollBy({ top: speed, left: 0, behavior: 'smooth' });
    } catch (error) {
      this.iframeWrapper.nativeElement.scrollBy(0, speed);
    }
  }

  zoomIn(): void {
    this.zoomLevel += this.ZOOM_SPEED;
  }
  zoomOut(): void {
    this.zoomLevel -= this.ZOOM_SPEED;
  }

  getZoom(): string {
    return `scale(${this.zoomLevel})`;
  }
}
