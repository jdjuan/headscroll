import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  keepShowingTutorial() {
    localStorage.setItem('showTutorial', JSON.stringify(true));
  }
  stopShowingTutorial() {
    localStorage.setItem('showTutorial', JSON.stringify(false));
  }
  shouldShowTutorial() {
    try {
      const showTutorial = localStorage.getItem('showTutorial');
      if (showTutorial) {
        return JSON.parse(showTutorial);
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return true;
    }
  }
}
