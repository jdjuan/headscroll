"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScrollerComponent = void 0;
var core_1 = require("@angular/core");
var until_destroy_1 = require("@ngneat/until-destroy");
var allow_camera_component_1 = require("./allow-camera/allow-camera.component");
var rxjs_1 = require("rxjs");
var camera_service_1 = require("../services/camera.service");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var blocked_camera_component_1 = require("./blocked-camera/blocked-camera.component");
var tutorial_component_1 = require("./tutorial/tutorial.component");
var ScrollerComponent = /** @class */ (function () {
    function ScrollerComponent(sanitizer, activatedRoute, proxyService, layoutService, modalService, cameraService) {
        var _this = this;
        this.sanitizer = sanitizer;
        this.activatedRoute = activatedRoute;
        this.proxyService = proxyService;
        this.layoutService = layoutService;
        this.modalService = modalService;
        this.cameraService = cameraService;
        this.SCROLL_SPEED = 5;
        this.SCROLL_SPEED_MOBILE_MULTIPLIER = 3;
        this.DEFAULT_IFRAME_HEIGHT = 3500;
        this.websiteSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.iframeHeight = this.DEFAULT_IFRAME_HEIGHT;
        this.website = '';
        this.hasCameraLoaded$ = new rxjs_2.Subject();
        this.checkCameraStatus = function () {
            _this.cameraService.hasCameraPermission().subscribe(function (isCameraAvailable) {
                console.log({ isCameraAvailable: isCameraAvailable });
                switch (isCameraAvailable) {
                    case camera_service_1.CameraStates.Timeout:
                        _this.openEnableCameraModal();
                        break;
                    case camera_service_1.CameraStates.Blocked:
                        _this.openBlockedCameraModal();
                        break;
                    case camera_service_1.CameraStates.Allowed:
                        _this.openInstructionsModal();
                        // Open dialog showing them instructions
                        break;
                }
            });
        };
        this.render = function (_a) {
            var isEmbeddable = _a.isEmbeddable, websiteUrl = _a.websiteUrl;
            if (isEmbeddable) {
                _this.websiteSafeUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(websiteUrl);
                _this.website = websiteUrl;
                _this.shouldRequestCam = true;
            }
            else {
                alert('Not embeddable');
            }
        };
        this.layoutService.isMobileOnce$.subscribe(function (isMobile) { return (_this.isMobile = isMobile); });
    }
    ScrollerComponent.prototype.ngOnInit = function () {
        this.checkCameraStatus();
        this.fetchWebsite();
    };
    ScrollerComponent.prototype.openEnableCameraModal = function () {
        var ref = this.modalService.open(allow_camera_component_1.AllowCameraComponent);
        rxjs_1.merge(ref.closed, ref.dismissed, this.hasCameraLoaded$).pipe(operators_1.take(1)).subscribe(this.checkCameraStatus);
    };
    ScrollerComponent.prototype.openBlockedCameraModal = function () {
        var ref = this.modalService.open(blocked_camera_component_1.BlockedCameraComponent);
        rxjs_1.merge(ref.closed, ref.dismissed, this.hasCameraLoaded$).pipe(operators_1.take(1)).subscribe(this.checkCameraStatus);
    };
    ScrollerComponent.prototype.onCameraLoaded = function (hasCameraLoaded) {
        this.hasCameraLoaded = hasCameraLoaded;
        if (hasCameraLoaded) {
            this.hasCameraLoaded$.next();
        }
    };
    ScrollerComponent.prototype.openInstructionsModal = function () {
        this.modalService.open(tutorial_component_1.TutorialComponent);
    };
    ScrollerComponent.prototype.fetchWebsite = function () {
        this.proxyService.getWebsiteUrl(this.activatedRoute.queryParams).pipe(until_destroy_1.untilDestroyed(this)).subscribe(this.render);
    };
    ScrollerComponent.prototype.searchWebsite = function (website) {
        this.iframeWrapper.nativeElement.scrollTo(0, 0);
        this.iframeHeight = this.DEFAULT_IFRAME_HEIGHT;
        this.proxyService.verifyWithProxy(website).subscribe(this.render);
    };
    ScrollerComponent.prototype.scrollDown = function () {
        // buffer added when the user reaches the iframe bottom
        var additionalBuffer = 200; // to avoid reaching the bottom
        var _a = this.iframeWrapper.nativeElement, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
        var iframeHeight = scrollHeight - clientHeight - additionalBuffer;
        var currentScroll = scrollTop;
        if (currentScroll >= iframeHeight) {
            this.iframeHeight += additionalBuffer;
        }
        this.performScroll(true);
    };
    ScrollerComponent.prototype.scrollUp = function () {
        this.performScroll(false);
    };
    ScrollerComponent.prototype.performScroll = function (scrollDown) {
        var speed = this.SCROLL_SPEED;
        if (this.isMobile) {
            speed *= this.SCROLL_SPEED_MOBILE_MULTIPLIER;
        }
        if (!scrollDown) {
            speed = -speed;
        }
        this.iframeWrapper.nativeElement.scrollBy(0, speed);
    };
    __decorate([
        core_1.ViewChild('iframeWrapper')
    ], ScrollerComponent.prototype, "iframeWrapper");
    ScrollerComponent = __decorate([
        until_destroy_1.UntilDestroy(),
        core_1.Component({
            selector: 'app-scroller',
            templateUrl: './scroller.component.html',
            styleUrls: ['./scroller.component.scss']
        })
    ], ScrollerComponent);
    return ScrollerComponent;
}());
exports.ScrollerComponent = ScrollerComponent;
