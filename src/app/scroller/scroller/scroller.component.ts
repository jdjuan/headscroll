import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LayoutService } from './../services/layout.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProxyService } from '../../core/proxy.service';
import { ActivatedRoute } from '@angular/router';
import { AllowCameraComponent } from './allow-camera/allow-camera.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs';
import { CameraService, CameraStates } from '../services/camera.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BlockedCameraComponent } from './blocked-camera/blocked-camera.component';
import { TutorialComponent } from './tutorial/tutorial.component';

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
  hasCameraLoaded: boolean;
  enableCameraModalRef: NgbModalRef;
  hasCameraLoaded$ = new Subject();

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private proxyService: ProxyService,
    private layoutService: LayoutService,
    private modalService: NgbModal,
    private cameraService: CameraService
  ) {
    this.layoutService.isMobileOnce$.subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnInit(): void {
    this.checkCameraStatus();
    this.fetchWebsite();
  }

  checkCameraStatus = (): void => {
    this.cameraService.hasCameraPermission().subscribe((isCameraAvailable) => {
      console.log({ isCameraAvailable });
      switch (isCameraAvailable) {
        case CameraStates.Timeout:
          this.openEnableCameraModal();
          break;
        case CameraStates.Blocked:
          this.openBlockedCameraModal();
          break;
        case CameraStates.Allowed:
          this.openInstructionsModal();
          // Open dialog showing them instructions
          break;
      }
    });
  }

  openEnableCameraModal(): void {
    const ref = this.modalService.open(AllowCameraComponent);
    merge(ref.closed, ref.dismissed, this.hasCameraLoaded$).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  openBlockedCameraModal(): void {
    const ref = this.modalService.open(BlockedCameraComponent);
    merge(ref.closed, ref.dismissed, this.hasCameraLoaded$).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  onCameraLoaded(hasCameraLoaded: boolean): void {
    this.hasCameraLoaded = hasCameraLoaded;
    if (hasCameraLoaded) {
      this.hasCameraLoaded$.next();
    }
  }

  openInstructionsModal(): void {
    this.modalService.open(TutorialComponent);
  }

  fetchWebsite(): void {
    this.proxyService.getWebsiteUrl(this.activatedRoute.queryParams).pipe(untilDestroyed(this)).subscribe(this.render);
  }

  searchWebsite(website: string): void {
    this.iframeWrapper.nativeElement.scrollTo(0, 0);
    this.iframeHeight = this.DEFAULT_IFRAME_HEIGHT;
    this.proxyService.verifyWithProxy(website).subscribe(this.render);
  }

  render = ({ isEmbeddable, websiteUrl }) => {
    if (isEmbeddable) {
      this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(websiteUrl);
      this.website = websiteUrl;
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
