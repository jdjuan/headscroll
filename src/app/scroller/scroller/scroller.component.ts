import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AllowCameraComponent } from './allow-camera/allow-camera.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge, of } from 'rxjs';
import { CameraService } from '../services/camera.service';
import { delay, filter, switchMap, take } from 'rxjs/operators';
import { BlockedCameraComponent } from './blocked-camera/blocked-camera.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { LARGE_BREAKPOINT } from 'src/app/core/constants';
import { ConfigModalComponent } from './config-modal/config-modal.component';
import { MobileWarningComponent } from './mobile-warning/mobile-warning.component';
import { StateService } from 'src/app/core/state.service';
import { AppState } from 'src/app/core/app-state';
import { ErrorType } from 'src/app/scroller/services/error.model';
import { Observable } from 'rxjs';

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
  isLoading = true;
  isConfigOpen: boolean;
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
    this.displayModals();
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

  displayModals(): void {
    this.stateService
      .select((state) => state.error)
      .subscribe((error) => {
        switch (error.type) {
          case ErrorType.CameraBlocked:
            this.openBlockedCameraModal();
            break;
          case ErrorType.CameraRequestTimedOut:
            this.openEnableCameraModal();
            break;
        }
      });
  }

  checkCameraStatus = (): void => {
    this.cameraService
      .hasCameraPermissions()
      .pipe(filter(Boolean), switchMap(this.openMobileWarning))
      .subscribe(() => {
        this.openInstructionsModal();
      });
  }

  openBlockedCameraModal(): void {
    const ref = this.modalService.open(BlockedCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed).pipe(take(1), delay(1000)).subscribe(this.checkCameraStatus);
  }

  openMobileWarning = (): Observable<boolean> => {
    if (this.isMobile && this.appState.showMobileWarning) {
      const ref = this.modalService.open(MobileWarningComponent, { centered: true });
      return merge(ref.closed, ref.dismissed).pipe(take(1));
    } else {
      return of(true);
    }
  }

  openEnableCameraModal(): void {
    const ref = this.modalService.open(AllowCameraComponent, { centered: true });
    merge(ref.closed, ref.dismissed).pipe(take(1)).subscribe(this.checkCameraStatus);
  }

  openInstructionsModal(): void {
    if (this.appState.showTutorial) {
      const ref = this.modalService.open(TutorialComponent, { centered: true });
      merge(ref.closed, ref.dismissed)
        .pipe(take(1))
        .subscribe(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }

  onSearchWebsite(website: string): void {
    this.iframeWrapper?.nativeElement.scrollTo(0, 0);
    this.iframeHeight = this.defaultIframeHeight;
    this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(website);
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
