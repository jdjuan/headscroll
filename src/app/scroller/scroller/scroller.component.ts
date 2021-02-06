import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, merge } from 'rxjs';
import { CameraService } from '../../core/services/camera.service';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { LARGE_BREAKPOINT } from 'src/app/core/models/constants';
import { StoreService } from 'src/app/core/services/store.service';
import { AppState } from 'src/app/core/models/app-state.model';
import { CameraStatus } from 'src/app/core/models/camera-status.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { WebglService } from 'src/app/core/services/webgl.service';
import { WebglStatus } from 'src/app/core/models/webgl-status.model';

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
  isMobile = this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
  isLoading = true;
  isConfigOpen: boolean;
  appState: AppState;

  constructor(
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private modalService: ModalService,
    private cameraService: CameraService,
    private webglService: WebglService,
    private viewportRuler: ViewportRuler,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.state$.subscribe((state) => (this.appState = state));
    const resize$ = this.viewportRuler.change(this.RESIZE_THROTLE_TIME);
    const breakpointChange$ = this.breakpointObserver.observe([LARGE_BREAKPOINT]);
    merge(resize$, breakpointChange$).subscribe(this.setIframeHeight);
    this.checkCameraStatus();
    this.checkWebglStatus();
    this.displayInstructions();
  }

  // define iframe height on resize and breakpoint change
  setIframeHeight = (result: Event | BreakpointState): void => {
    const isMobile = (result as BreakpointState).matches;
    if (isMobile !== undefined) {
      this.storeService.updateState({ isMobile });
      this.isMobile = isMobile;
    }
    if (this.isMobile) {
      this.defaultIframeHeight = window.innerHeight * 0.86 - 64;
    } else {
      this.defaultIframeHeight = window.innerHeight * 0.97 - 74;
    }
    this.iframeHeight = this.defaultIframeHeight;
  }

  checkCameraStatus(): void {
    let modalRef: NgbModalRef;
    const cameraStatus$ = this.storeService.select((state) => state.cameraStatus);
    cameraStatus$.subscribe((cameraStatus) => {
      switch (cameraStatus) {
        case CameraStatus.Blocked:
          this.modalService.openBlockedCameraModal();
          break;
        case CameraStatus.TimedOut:
          modalRef = this.modalService.openEnableCameraModal();
          break;
        case CameraStatus.Ready:
          modalRef?.close();
          break;
      }
    });
    this.cameraService.requestCameraAccess();
  }

  checkWebglStatus(): void {
    const isCameraReady = (status: CameraStatus) => status === CameraStatus.Ready;
    const cameraStatus$ = this.storeService.select((state) => state.cameraStatus).pipe(filter(isCameraReady));
    const webglStatus$ = this.storeService.select((state) => state.webglStatus);
    combineLatest([cameraStatus$, webglStatus$]).subscribe(([cameraStatus, webglStatus]) => {
      switch (webglStatus) {
        case WebglStatus.Unknown:
          this.webglService.detectWebGLContext().subscribe();
          break;
        case WebglStatus.NotSupported:
          this.modalService.openWebglNotSupportedModal();
          break;
      }
    });
  }

  displayInstructions(): void {
    const isWebglSupported = (status: WebglStatus) => status === WebglStatus.Supported;
    const webglStatus$ = this.storeService.select((state) => state.webglStatus).pipe(filter(isWebglSupported));
    webglStatus$.subscribe(() => {
      if (this.isMobile && this.appState.showMobileWarning) {
        this.modalService.openMobileWarning().subscribe(this.displayTutorial);
      } else {
        this.displayTutorial();
      }
    });
  }

  displayTutorial = (): void => {
    if (this.appState.showTutorial) {
      this.modalService.openInstructionsModal().subscribe(() => {
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }

  onSearchWebsite(): void {
    this.iframeWrapper?.nativeElement.scrollTo(0, 0);
    this.iframeHeight = this.defaultIframeHeight;
    const { proxyUrl } = this.appState.currentWebsite;
    this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(proxyUrl);
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
    this.modalService.openConfigModal().subscribe(() => {
      this.isConfigOpen = false;
    });
  }
}
