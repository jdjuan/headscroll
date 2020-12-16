import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LayoutService } from './../services/layout.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProxyService } from '../services/proxy.service';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
})
export class ScrollerComponent implements OnInit {
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly SCROLL_SPEED = 11;
  readonly SCROLL_SPEED_MOBILE_MULTIPLIER = 4;
  readonly SCROLL_BUFFER = 200; // buffer added when the user reaches the iframe bottom
  readonly ZOOM_SPEED = 0.3;
  websiteSafeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  websiteUrl = '';
  iframeHeight = 1500; // initial iframe height
  zoomLevel = 1;
  isMobile: boolean;
  // javascript: window.open('http://localhost:4200/' + encodeURIComponent(location.href));

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private proxyService: ProxyService,
    private layoutService: LayoutService
  ) {
    this.layoutService.isMobileOnce$.subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnInit(): void {
    this.fetchWebsite();
  }

  fetchWebsite(): void {
    this.proxyService
      .getWebsiteUrl(this.activatedRoute.params)
      .pipe(untilDestroyed(this))
      .subscribe(({ isEmbeddable, websiteUrl }) => {
        if (isEmbeddable) {
          this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(websiteUrl);
          this.websiteUrl = websiteUrl;
        } else {
          alert('Not embeddable');
        }
      });
  }

  renderWebsite(websiteUrl: string): void {
    this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(websiteUrl);
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
