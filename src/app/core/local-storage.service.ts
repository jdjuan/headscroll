import { Injectable } from '@angular/core';

enum PropertyKeys {
  Speed = 'speed',
  ShowTutorial = 'showTutorial',
  Orientation = 'orientation',
  ShowWarning = 'showWarning',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly DEFAULT_ORIENTATION = false;
  readonly DEFAULT_SPEED = 5;
  readonly DEFAULT_SHOW_TUTORIAL = true;
  readonly DEFAULT_SHOW_WARNING = true;
  constructor() {}

  setShowWarning(value: boolean): void {
    localStorage.setItem(PropertyKeys.ShowWarning, JSON.stringify(value));
  }
  getShowWarning(): boolean {
    return this.getProp(PropertyKeys.ShowWarning, this.DEFAULT_SHOW_WARNING);
  }

  setOrientation(value: boolean): void {
    localStorage.setItem(PropertyKeys.Orientation, JSON.stringify(value));
  }
  getOrientation(): boolean {
    return this.getProp(PropertyKeys.Orientation, this.DEFAULT_ORIENTATION);
  }

  setSpeed(value: number): void {
    localStorage.setItem(PropertyKeys.Speed, JSON.stringify(value));
  }
  getSpeed(): number {
    return this.getProp(PropertyKeys.Speed, this.DEFAULT_SPEED);
  }

  setShowTutorial(value: boolean): void {
    localStorage.setItem(PropertyKeys.ShowTutorial, JSON.stringify(value));
  }
  getShowTutorial(): boolean {
    return this.getProp(PropertyKeys.ShowTutorial, this.DEFAULT_SHOW_TUTORIAL);
  }

  private getProp(propName: string, defaultValue?: any): any {
    try {
      if (localStorage.getItem(propName)) {
        return JSON.parse(localStorage.getItem(propName));
      } else {
        return defaultValue;
      }
    } catch (error) {
      return defaultValue;
    }
  }
}
