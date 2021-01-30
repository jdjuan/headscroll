import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AllowCameraComponent } from './allow-camera/allow-camera.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs';
import { CameraService, CameraStates } from '../services/camera.service';
import { take } from 'rxjs/operators';
import { BlockedCameraComponent } from './blocked-camera/blocked-camera.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { LARGE_BREAKPOINT } from 'src/app/core/constants';
import { ConfigModalComponent } from './config-modal/config-modal.component';
import { MobileWarningComponent } from './mobile-warning/mobile-warning.component';
import { StateService } from 'src/app/core/state.service';
import { AppState } from 'src/app/core/app-state';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss'],
})
export class ScrollerComponent implements OnInit {
  @ViewChild('iframeWrapper') iframeWrapper: ElementRef;
  readonly RESIZE_THROTLE_TIME = 100;
  websiteSafeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  defaultIframeHeight: number;
  iframeHeight: number;
  website: string;
  isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
  shouldRequestCam: boolean;
  isLoading = true;
  isTutorialFinished: boolean;
  isConfigOpen: boolean;
  hasAtLeastLoadedAWebsite: boolean;
  isWarningAccepted: boolean;
  appState: AppState;

  constructor(
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private modalService: NgbModal,
    private cameraService: CameraService,
    private viewportRuler: ViewportRuler,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.state$.subscribe((state) => {
      this.appState = state;
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

  onSearchWebsite(website: string): void {
    this.hasAtLeastLoadedAWebsite = true;
    this.iframeWrapper?.nativeElement.scrollTo(0, 0);
    this.iframeHeight = this.defaultIframeHeight;
    this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(website);
    this.shouldRequestCam = true;
  }

  onScroll(direction: boolean): void {
    if (!this.appState.error && !this.isLoading && !this.isConfigOpen) {
      if (this.appState.orientation === direction) {
        this.scrollDown();
      } else {
        this.scrollUp();
      }
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
    let speed = this.appState.speed;
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
