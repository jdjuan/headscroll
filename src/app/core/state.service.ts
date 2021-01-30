import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinct, filter, map, take } from 'rxjs/operators';
import { AppState, initialState } from 'src/app/core/app-state';
import { ErrorMessages, ErrorType } from 'src/app/scroller/services/error.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _state$ = new BehaviorSubject<AppState>(initialState);
  state$ = this._state$.asObservable();
  error$ = this._state$.pipe(
    map((state) => state.error),
    filter((error) => !!error),
    distinct()
  );

  constructor() {
    this.getLatestFromLocalStorage();
  }

  updateState(prop: Partial<AppState>): void {
    this.state$.pipe(take(1)).subscribe((oldState) => {
      const newState = { ...oldState, ...prop };
      this._state$.next(newState);
      this.persistState(newState);
    });
  }

  persistState(newState: AppState): void {
    const { speed, orientation, showMobileWarning, showTutorial } = newState;
    localStorage.setItem('state', JSON.stringify({ speed, orientation, showMobileWarning, showTutorial }));
  }

  dispatchError(type: ErrorType): void {
    const error = { type, message: ErrorMessages[type] };
    this.updateState({ error });
  }

  private getLatestFromLocalStorage(): void {
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
