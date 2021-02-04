import { Component, Output, EventEmitter, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { filter, pluck } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { ErrorMessages, ErrorType, ScrollerError } from 'src/app/core/models/error.model';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { UrlService } from 'src/app/core/services/url.service';

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
  isLoading = true;
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
    this.onError();
    this.storeService
      .select((state) => state.whitelist)
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.isLoading = false;
        this.onBookmarkletSearch();
      });
  }

  onError(): void {
    this.storeService
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
      this.proxyService.validateWebsite(this.website).subscribe((isValid) => {
        if (isValid) {
          this.urlService.updateUrl(this.website);
          this.loadWebsite();
        } else {
          this.storeService.dispatchError(ErrorType.NotSupported);
        }
      });
    });
  }

  onInputSearch(): void {
    if (this.website) {
      this.errorTooltip?.close();
      this.shouldShowFavicon = false;
      this.isLoading = true;
      this.proxyService.validateWebsite(this.website).subscribe((isValid) => {
        if (isValid) {
          this.loadWebsite();
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

  private loadWebsite(): void {
    this.isLoading = false;
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
