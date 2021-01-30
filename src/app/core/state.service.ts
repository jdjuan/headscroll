import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ScrollerError } from 'src/app/scroller/services/error.model';

export interface AppState {
  speed: number;
  orientation: boolean;
  currentWebsite: string;
  showTutorial: boolean;
  showMobileWarning: boolean;
  error: ScrollerError;
}

export const initialState = {
  speed: 5,
  orientation: false,
  currentWebsite: null,
  showTutorial: true,
  showMobileWarning: true,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _state$ = new BehaviorSubject<AppState>(initialState);
  state$ = this._state$.asObservable();

  constructor() {
    this.getLatestFromLocalStorate();
  }

  updateState(prop: Partial<AppState>): void {
    this.state$.pipe(take(1)).subscribe((state) => {
      const newState = { ...state, ...prop };
      this._state$.next(newState);
      localStorage.setItem('state', JSON.stringify(newState));
    });
  }

  private getLatestFromLocalStorate(): void {
    try {
      const persistedState = JSON.parse(localStorage.getItem('state'));
      if (persistedState) {
        this.updateState(persistedState);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
