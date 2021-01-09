import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _scrollSpeed$ = new BehaviorSubject<number>(this.localStorageService.getSpeed());
  private _direction$ = new BehaviorSubject<boolean>(this.localStorageService.getDirection());

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
  changeSpeed(speed: number): void {
    this.localStorageService.setSpeed(speed);
    this._scrollSpeed$.next(speed);
  }
  changeDirection(direction: boolean): void {
    this.localStorageService.setDirection(direction);
    this._direction$.next(direction);
  }

  // get defaultConfig(): Observable<any> {
  // return this._speed$.asObservable();
  // }
  get scrollSpeed(): Observable<number> {
    return this._scrollSpeed$.asObservable();
  }

  get direction$(): Observable<boolean> {
    return this._direction$.asObservable();
  }
}
