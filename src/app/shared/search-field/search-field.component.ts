import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ProxyService } from 'src/app/core/proxy.service';
import { UrlService } from 'src/app/core/url.service';
import { ConfigService } from 'src/app/scroller/services/config.service';

enum ErrorMessages {
  Cors = 'We could not display this website, please try another one.',
  Required = 'Enter the URL of the website you wish to scroll.',
}

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit {
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
  website: string;
  loading: boolean;
  notEmbeddable: boolean;
  hasSearched: boolean;
  isInputFocused: boolean;
  favicon: string;
  shouldShowFavicon = true;

  constructor(private proxyService: ProxyService, private configService: ConfigService, private urlService: UrlService) {}

  ngOnInit(): void {
    // Ensure the tooltip shows a message to the user the first it is loaded with wrong url
    if (this.notEmbeddable) {
      this.openTooltip();
    }
  }

  onSearch(): void {
    this.errorTooltip?.close();
    this.shouldShowFavicon = false;
    this.hasSearched = true;
    if (this.website) {
      this.notEmbeddable = false;
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
      this.errorTooltipMessage = ErrorMessages.Required;
      this.openTooltip();
    }
  }

  private showError(): void {
    this.fail.emit();
    this.notEmbeddable = true;
    this.shouldShowFavicon = false;
    this.errorTooltipMessage = ErrorMessages.Cors;
    this.openTooltip();
  }

  private loadWebsite(): void {
    this.configService.updateCurrentWebsite(this.website);
    this.favicon = this.getFavicon(this.website);
    this.search.emit(this.website);
  }

  openTooltip(): void {
    if (this.isCompactVersion) {
      this.errorTooltip?.open();
    }
  }

  cleanValidation(): void {
    this.notEmbeddable = false;
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
