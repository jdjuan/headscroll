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
import { Location } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { LARGE_BREAKPOINT } from 'src/app/core/constants';
import { ConfigModalComponent } from './config-modal/config-modal.component';
import { MobileWarningComponent } from './mobile-warning/mobile-warning.component';
import { AppState, StateService } from 'src/app/core/state.service';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
})
export class ScrollerComponent implements OnInit {
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  scrollSpeed: number;
  readonly RESIZE_THROTLE_TIME = 100;
  websiteSafeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  defaultIframeHeight: number;
  iframeHeight: number;
  website: string;
  isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
  shouldRequestCam: boolean;
  enableCameraModalRef: NgbModalRef;
  isLoading = true;
  isTutorialFinished: boolean;
  isConfigOpen: boolean;
  hasSearchFailed: boolean;
  hasAtLeastLoadedAWebsite: boolean;
  showShowWarning: boolean;
  isWarningAccepted: boolean;
  orientation: boolean;
  appState: AppState;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private modalService: NgbModal,
    private cameraService: CameraService,
    private location: Location,
    private router: Router,
    private viewportRuler: ViewportRuler,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.state$.subscribe((state) => {
      this.appState = state;
      this.scrollSpeed = state.speed;
      this.orientation = state.orientation;
    });
    this.viewportRuler.change(this.RESIZE_THROTLE_TIME).subscribe(() => {
      // define iframe height on resize
      this.defineIframeHeight();
    });
    this.breakpointObserver.observe([LARGE_BREAKPOINT]).subscribe(({ matches }) => {
      // define iframe height on breakpoint change
      this.isMobile = matches;
      this.defineIframeHeight();
    });

    this.getWebsiteFromUrl();
    this.checkCameraStatus();
  }

  defineIframeHeight(): void {
    if (this.isMobile) {
      this.defaultIframeHeight = window.innerHeight * 0.86 - 64;
    } else {
      this.defaultIframeHeight = window.innerHeight * 0.97 - 74;
    }
    this.iframeHeight = this.defaultIframeHeight;
  }

  checkCameraStatus = (): void => {
    this.cameraService.hasCameraPermission().subscribe((isCameraAvailable) => {
      switch (isCameraAvailable) {
        case CameraStates.Timeout:
          this.openEnableCameraModal();
          break;
        case CameraStates.Blocked:
          this.openBlockedCameraModal();
          break;
        case CameraStates.Allowed:
          if (this.isMobile && !this.isWarningAccepted && this.appState.showMobileWarning) {
            this.openMobileWarning();
          } else {
            this.openInstructionsModal();
          }
          break;
      }
    });
  }

  openMobileWarning(): void {
    const ref = this.modalService.open(MobileWarningComponent, { centered: true });
    merge(ref.closed, ref.dismissed)
      .pipe(take(1))
      .subscribe(() => {
        this.isWarningAccepted = true;
        this.checkCameraStatus();
      });
  }

  openEnableCameraModal(): void {
    const ref = this.modalService.open(AllowCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  openBlockedCameraModal(): void {
    const ref = this.modalService.open(BlockedCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  openInstructionsModal(): void {
    if (this.appState.showTutorial) {
      const ref = this.modalService.open(TutorialComponent, { centered: true });
      merge(ref.closed, ref.dismissed)
        .pipe(take(1))
        .subscribe(() => {
          this.isTutorialFinished = true;
          this.isLoading = false;
        });
    } else {
      this.isTutorialFinished = true;
      this.isLoading = false;
    }
  }

  getWebsiteFromUrl(): void {
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

  onScroll(direction: boolean): void {
    // XOR
    if (this.orientation !== direction) {
      this.scrollUp();
    } else {
      this.scrollDown();
    }
  }

  scrollDown(): void {
    if (!this.isLoading && !this.hasSearchFailed && !this.isConfigOpen) {
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
  }

  scrollUp(): void {
    if (!this.isLoading && !this.hasSearchFailed && !this.isConfigOpen) {
      this.performScroll(false);
    }
  }

  performScroll(scrollDown: boolean): void {
    let speed = this.scrollSpeed;
    if (!scrollDown) {
      speed = -speed;
    }

    this.iframeWrapper.nativeElement.scrollBy(0, speed);
  }

  openConfig(): void {
    this.isConfigOpen = true;
    const ref = this.modalService.open(ConfigModalComponent, { scrollable: true, windowClass: 'config-modal' });
    merge(ref.closed, ref.dismissed)
      .pipe(take(1))
      .subscribe(() => {
        this.isConfigOpen = false;
      });
  }
}
