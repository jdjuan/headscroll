import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { ErrorMessages, ErrorType, ScrollerError } from 'src/app/scroller/services/error.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _scrollSpeed$ = new BehaviorSubject<number>(this.localStorageService.getSpeed());
  private _direction$ = new BehaviorSubject<boolean>(this.localStorageService.getDirection());
  private _currentWebsite$ = new BehaviorSubject<string>('');
  private _error$ = new BehaviorSubject<ScrollerError>({ type: null, message: null });

  readonly CAMERA_PERMISSION_TIMEOUT = 2000;

  constructor(private localStorageService: LocalStorageService) {}

  keepShowingTutorial(): void {
    this.localStorageService.setShowTutorial(true);
  }
  stopShowingTutorial(): void {
    this.localStorageService.setShowTutorial(false);
  }
  shouldShowTutorial(): boolean {
    return this.localStorageService.getShowTutorial();
  }

  keepShowingWarning(): void {
    this.localStorageService.setShowWarning(true);
  }
  stopShowingWarning(): void {
    this.localStorageService.setShowWarning(false);
  }
  shouldShowWarning(): boolean {
    return this.localStorageService.getShowWarning();
  }

  changeSpeed(speed: number): void {
    this.localStorageService.setSpeed(speed);
    this._scrollSpeed$.next(speed);
  }
  changeDirection(direction: boolean): void {
    this.localStorageService.setDirection(direction);
    this._direction$.next(direction);
  }
  updateCurrentWebsite(website: string): void {
    this._currentWebsite$.next(website);
  }
  throwError(type: ErrorType): void {
    this._error$.next({ type, message: ErrorMessages[type] });
  }

  get scrollSpeed(): Observable<number> {
    return this._scrollSpeed$.asObservable();
  }
  get direction$(): Observable<boolean> {
    return this._direction$.asObservable();
  }
  get currentWebsite$(): Observable<string> {
    return this._currentWebsite$.asObservable();
  }
  get error$(): Observable<ScrollerError> {
    return this._error$.asObservable();
  }
}
