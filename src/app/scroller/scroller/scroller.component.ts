import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AllowCameraComponent } from './allow-camera/allow-camera.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs';
import { CameraService, CameraStates } from '../services/camera.service';
import { pluck, take } from 'rxjs/operators';
import { BlockedCameraComponent } from './blocked-camera/blocked-camera.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Location } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LARGE_BREAKPOINT } from 'src/app/core/constants';
import { ConfigComponent } from './config/config.component';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
})
export class ScrollerComponent implements OnInit {
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly SCROLL_SPEED = 5;
  readonly SCROLL_SPEED_MOBILE_MULTIPLIER = 3;
  websiteSafeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  defaultIframeHeight: number;
  iframeHeight: number;
  website: string;
  isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
  shouldRequestCam: boolean;
  hasCameraLoaded: boolean;
  enableCameraModalRef: NgbModalRef;
  isLoading = true;
  isTutorialFinished: boolean;
  isConfigOpen: boolean;
  hasSearchFailed: boolean;
  hasAtLeastLoadedAWebsite: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private modalService: NgbModal,
    private cameraService: CameraService,
    private localStorage: LocalStorageService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([LARGE_BREAKPOINT]).subscribe(({ matches }) => {
      this.isMobile = matches;
      this.defineIframeHeight();
    });

    this.getWebsiteFromParams();
    this.checkCameraStatus();
  }

  defineIframeHeight(): void {
    if (this.isMobile) {
      this.defaultIframeHeight = window.innerHeight * 0.86 - 64;
    } else {
      this.defaultIframeHeight = window.innerHeight * 0.97 - 64;
    }
    this.iframeHeight = this.defaultIframeHeight;
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
  }

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

  getWebsiteFromParams(): void {
    this.activatedRoute.queryParams.pipe(pluck('website')).subscribe((website: string) => {
      // triggers lookup in search-field component, which later triggers searchWebsite()
      this.website = website;
    });
  }

  searchWebsite(website: string): void {
    const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { website } }).toString();
    this.location.go(url);
    this.hasAtLeastLoadedAWebsite = true;
    this.hasSearchFailed = false;
    this.iframeWrapper?.nativeElement.scrollTo(0, 0);
    this.iframeHeight = this.defaultIframeHeight;
    this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(website);
    this.shouldRequestCam = true;
  }

  onSearchFail(): void {
    if (!this.hasAtLeastLoadedAWebsite) {
      this.hasSearchFailed = true;
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
    if (!this.isLoading && !this.hasSearchFailed && !this.isConfigOpen) {
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

  openConfig(): void {
    this.isConfigOpen = true;
    const ref = this.modalService.open(ConfigComponent);
    merge(ref.closed, ref.dismissed)
      .pipe(take(1))
      .subscribe(() => {
        this.isConfigOpen = false;
      });
  }
}
