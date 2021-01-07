import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LayoutService } from './../services/layout.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProxyService } from '../../core/proxy.service';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
})
export class ScrollerComponent implements OnInit {
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly SCROLL_SPEED = 5;
  readonly SCROLL_SPEED_MOBILE_MULTIPLIER = 3;
  readonly DEFAULT_IFRAME_HEIGHT = 3500;
  websiteSafeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  iframeHeight = this.DEFAULT_IFRAME_HEIGHT;
  website = '';
  isMobile: boolean;
  shouldRequestCam: boolean;

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
    this.proxyService.getWebsiteUrl(this.activatedRoute.queryParams).pipe(untilDestroyed(this)).subscribe(this.render);
  }

  searchWebsite(website: string): void {
    console.log(this.iframeWrapper.nativeElement.scrollTo(0, 0));

    this.iframeHeight = this.DEFAULT_IFRAME_HEIGHT;
    this.proxyService.verifyWithProxy(website).pipe(untilDestroyed(this)).subscribe(this.render);
  }

  render = ({ isEmbeddable, websiteUrl }) => {
    if (isEmbeddable) {
      this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(websiteUrl);
      this.website = websiteUrl;
      console.log({ websiteUrl });
      this.shouldRequestCam = true;
    } else {
      alert('Not embeddable');
    }
  }

  scrollDown(): void {
    // buffer added when the user reaches the iframe bottom
    const additionalBuffer = 200; // to avoid reaching the bottom
    const { scrollTop, scrollHeight, clientHeight } = this.iframeWrapper.nativeElement;
    const iframeHeight = scrollHeight - clientHeight - additionalBuffer;
    const currentScroll = scrollTop;
    if (currentScroll >= iframeHeight) {
      this.iframeHeight += additionalBuffer;
    }
    this.performScroll(true);
  }

  scrollUp(): void {
    this.performScroll(false);
  }

  performScroll(scrollDown: boolean): void {
    let speed = this.SCROLL_SPEED;
    if (this.isMobile) {
      speed *= this.SCROLL_SPEED_MOBILE_MULTIPLIER;
    }
    if (!scrollDown) {
      speed = -speed;
    }

    this.iframeWrapper.nativeElement.scrollBy(0, speed);
  }
}
