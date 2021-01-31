import { Component, Output, EventEmitter, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { filter, pluck } from 'rxjs/operators';
import { StateService } from 'src/app/core/state.service';
import { ErrorMessages, ErrorType, ScrollerError } from 'src/app/scroller/services/error.model';
import { ProxyService } from 'src/app/core/proxy.service';
import { UrlService } from 'src/app/core/url.service';
import { AppState } from 'src/app/core/app-state';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit {
  @ViewChild('tooltip') errorTooltip: NgbTooltip;
  @Input() isCompactVersion = false;
  @Output() search = new EventEmitter();
  errorTooltipMessage: string;
  website = 'https://tabs.ultimate-guitar.com/tab/the-lumineers/stubborn-love-chords-1157323';
  isLoading: boolean;
  isInputFocused: boolean;
  favicon: string;
  shouldShowFavicon = true;
  appState: AppState;
  error: ScrollerError;

  constructor(
    private activatedRoute: ActivatedRoute,
    private proxyService: ProxyService,
    private stateService: StateService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.stateService.state$.subscribe((state) => (this.appState = state));
    this.onError();
    this.onBookmarkletSearch();
  }

  onError(): void {
    this.stateService
      .select((state) => state.error)
      .subscribe((error) => {
        const errors = [ErrorType.Required, ErrorType.NotSupported];
        if (errors.includes(error.type)) {
          this.showError(error.message);
        }
      });
  }

  onBookmarkletSearch(): void {
    this.activatedRoute.queryParams.pipe(pluck('website'), filter<string>(Boolean)).subscribe((website: string) => {
      this.website = website;
      this.favicon = this.getFavicon(website);
      this.isLoading = true;
      if (this.proxyService.validateWebsite(this.website)) {
        this.urlService.updateUrl(this.website);
        this.loadWebsite();
      }
    });
  }

  onInputSearch(): void {
    if (this.website) {
      this.errorTooltip?.close();
      this.shouldShowFavicon = false;
      this.isLoading = true;
      if (this.proxyService.validateWebsite(this.website)) {
        this.loadWebsite();
      }
    } else {
      this.errorTooltipMessage = ErrorMessages.UrlIsRequired;
      this.stateService.dispatchError(ErrorType.Required);
    }
  }

  private showError(message: string): void {
    this.isLoading = false;
    this.shouldShowFavicon = false;
    this.errorTooltipMessage = message;
    setTimeout(() => {
      this.errorTooltip?.open();
    }, 0);
  }

  private loadWebsite(): void {
    this.isLoading = false;
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
