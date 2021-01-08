import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LayoutService } from './../services/layout.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ProxyService } from '../../core/proxy.service';
import { ActivatedRoute } from '@angular/router';
import { AllowCameraComponent } from './allow-camera/allow-camera.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs';
import { CameraService, CameraStates } from '../services/camera.service';
import { take } from 'rxjs/operators';
import { BlockedCameraComponent } from './blocked-camera/blocked-camera.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { LocalStorageService } from 'src/app/core/local-storage.service';

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
  isLoading = true;
  isTutorialFinished: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private proxyService: ProxyService,
    private layoutService: LayoutService,
    private modalService: NgbModal,
    private cameraService: CameraService,
    private localStorage: LocalStorageService
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
          break;
      }
    });
  };

  openEnableCameraModal(): void {
    const ref = this.modalService.open(AllowCameraComponent);
    merge(ref.closed, ref.dismissed).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  openBlockedCameraModal(): void {
    const ref = this.modalService.open(BlockedCameraComponent);
    merge(ref.closed, ref.dismissed).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  onCameraLoaded(): void {
    this.hasCameraLoaded = true;
    if (this.isTutorialFinished) {
      this.isLoading = false;
    }
  }

  openInstructionsModal(): void {
    if (this.localStorage.shouldShowTutorial()) {
      const ref = this.modalService.open(TutorialComponent);
      merge(ref.closed, ref.dismissed)
        .pipe(take(1))
        .subscribe(() => {
          this.isTutorialFinished = true;
          if (this.hasCameraLoaded) {
            this.isLoading = false;
          }
        });
    } else {
      this.isTutorialFinished = true;
    }
  }

  fetchWebsite(): void {
    this.proxyService.getWebsiteUrl(this.activatedRoute.queryParams).subscribe(this.render);
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
  };

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
    if (!this.isLoading) {
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
}
