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
  speed: 20,
  orientation: false,
  currentWebsite: null,
  showTutorial: true,
  showMobileWarning: true,
  error: null,
};
