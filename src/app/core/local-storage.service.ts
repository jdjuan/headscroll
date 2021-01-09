import { Injectable } from '@angular/core';

enum PropertyKeys {
  Speed = 'speed',
  ShowTutorial = 'showTutorial',
  Direction = 'direction',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly DEFAULT_DIRECTION = false;
  readonly DEFAULT_SPEED = 5;
  readonly DEFAULT_SHOW_TUTORIAL = true;
  constructor() {}

  setDirection(value: boolean): void {
    localStorage.setItem(PropertyKeys.Direction, JSON.stringify(value));
  }
  getDirection(): boolean {
    return this.getProp(PropertyKeys.Direction, this.DEFAULT_DIRECTION);
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
