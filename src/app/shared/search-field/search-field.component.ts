import { Component, Output, EventEmitter, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { filter, pluck } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScrollerError, ErrorType, ErrorMessages } from '@core/models/error.model';
import { ProxyService } from '@core/services/proxy.service';
import { StoreService } from '@core/services/store.service';
import { UrlService } from '@core/services/url.service';

@UntilDestroy()
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
  website: string;
  isLoading: boolean;
  isInputFocused: boolean;
  favicon: string;
  shouldShowFavicon = true;
  error: ScrollerError;

  constructor(
    private activatedRoute: ActivatedRoute,
    private proxyService: ProxyService,
    private storeService: StoreService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.storeService.updateState({ error: null });
    this.onBookmarkletSearch();
    this.onError();
  }

  onBookmarkletSearch(): void {
    this.activatedRoute.queryParams
      .pipe(pluck('website'), filter<string>(Boolean))
      .pipe(untilDestroyed(this))
      .subscribe((website: string) => {
        this.onSearch(website);
      });
  }

  onError(): void {
    this.storeService
      .select((state) => state.error)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        const errors = [ErrorType.Required, ErrorType.NotSupported];
        if (errors.includes(error.type)) {
          this.showError(error.message);
        }
      });
  }

  onSearch(website: string): void {
    if (website) {
      this.isLoading = true;
      website = this.urlService.normalizeUrl(website);
      this.website = website;
      this.errorTooltip?.close();
      this.shouldShowFavicon = false;
      this.favicon = this.getFavicon(website);
      this.proxyService
        .validateWebsite(website)
        .pipe(untilDestroyed(this))
        .subscribe((isValid) => {
          if (isValid) {
            this.storeService.updateState({ error: null });
            this.urlService.updateUrl(website);
            this.loadWebsite(website);
          } else {
            this.storeService.dispatchError(ErrorType.NotSupported);
          }
        });
    } else {
      this.errorTooltipMessage = ErrorMessages.UrlIsRequired;
      this.storeService.dispatchError(ErrorType.Required);
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

  private loadWebsite(website: string): void {
    this.isLoading = false;
    this.favicon = this.getFavicon(website);
    this.search.emit(website);
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
