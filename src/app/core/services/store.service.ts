import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { distinct, filter, map, take } from 'rxjs/operators';
import { AppState, initialState } from 'src/app/core/models/app-state.model';
import { ErrorMessages, ErrorType } from 'src/app/core/models/error.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _state$ = new BehaviorSubject<AppState>(initialState);
  state$ = this._state$.asObservable();

  constructor() {
    this.getLatestFromLocalStorage();
  }

  select<K>(selectorfn: (state: AppState) => K): Observable<K> {
    return this._state$.pipe(
      map(selectorfn),
      filter((stateProp) => !!stateProp),
      distinct()
    );
  }

  updateState(prop: Partial<AppState>): void {
    this.state$.pipe(take(1)).subscribe((oldState) => {
      const newState = { ...oldState, ...prop };
      this._state$.next(newState);
      this.persistState(newState);
    });
  }

  dispatchError(type: ErrorType): void {
    const error = { type, message: ErrorMessages[type] };
    this.updateState({ error });
  }

  private persistState(newState: AppState): void {
    const { speed, orientation, showMobileWarning, showTutorial } = newState;
    localStorage.setItem('state', JSON.stringify({ speed, orientation, showMobileWarning, showTutorial }));
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
