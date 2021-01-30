import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ProxyService } from 'src/app/core/proxy.service';
import { AppState, StateService } from 'src/app/core/state.service';
import { UrlService } from 'src/app/core/url.service';
import { ErrorMessages } from 'src/app/scroller/services/error.model';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent {
  @ViewChild('tooltip') errorTooltip: NgbTooltip;
  @Input() set url(value: string) {
    if (value) {
      this.favicon = this.getFavicon(value);
      this.website = value;
      this.onSearch();
    }
  }
  @Input() isCompactVersion = false;
  @Output() search = new EventEmitter();
  @Output() fail = new EventEmitter();
  errorTooltipMessage: string;
  errorMessages = ErrorMessages;
  website = 'https://tabs.ultimate-guitar.com/tab/the-lumineers/stubborn-love-chords-1157323';
  loading: boolean;
  notEmbeddable: boolean;
  hasSearched: boolean;
  isInputFocused: boolean;
  favicon: string;
  shouldShowFavicon = true;
  appState: AppState;

  constructor(private proxyService: ProxyService, private urlService: UrlService, private stateService: StateService) {}

  onSearch(): void {
    this.stateService.state$.subscribe((state) => (this.appState = state));
    this.errorTooltip?.close();
    this.shouldShowFavicon = false;
    this.hasSearched = true;
    if (this.website) {
      this.loading = true;
      this.website = this.urlService.normalizeUrl(this.website);
      this.proxyService.isEmbeddable(this.website).subscribe((isEmbeddable) => {
        this.loading = false;
        if (isEmbeddable) {
          this.loadWebsite();
        } else {
          this.showError();
        }
      });
    } else {
      this.errorTooltipMessage = ErrorMessages.UrlIsRequired;
      this.errorTooltip?.open();
    }
  }

  private showError(): void {
    this.fail.emit();
    this.shouldShowFavicon = false;
    this.errorTooltipMessage = this.appState.error.message;
    this.errorTooltip?.open();
  }

  private loadWebsite(): void {
    this.stateService.updateState({ currentWebsite: this.website });
    this.favicon = this.getFavicon(this.website);
    this.search.emit(this.website);
  }

  getFavicon(website: string): string {
    this.shouldShowFavicon = true;
    try {
      const url = new URL(website);
      const [subdomain, ...rest] = url.hostname.split('.');
      let newUrl = '';
      if (rest.length > 1) {
        newUrl = rest.join('.');
      } else {
        newUrl = url.hostname;
      }
      return `${url.protocol}//${newUrl}/favicon.ico`;
    } catch (error) {
      this.shouldShowFavicon = false;
      return '';
    }
  }
}
