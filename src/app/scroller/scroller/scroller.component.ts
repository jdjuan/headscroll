import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LayoutService } from './../services/layout.service';

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
  source: SafeResourceUrl;
  iframeHeight = 1500; // initial iframe height
  zoomLevel = 1;
  isMobile: boolean;

  constructor(sanitizer: DomSanitizer, layoutService: LayoutService) {
    this.source = sanitizer.bypassSecurityTrustResourceUrl(
      'https://tabs.ultimate-guitar.com/tab/foo-fighters/times-like-these-chords-1211863'
    );
    layoutService.isMobile.toPromise().then((isMobile) => (this.isMobile = isMobile));
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
