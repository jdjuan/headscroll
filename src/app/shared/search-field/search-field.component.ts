import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProxyService } from 'src/app/core/proxy.service';

enum ErrorMessages {
  Cors = 'We couldn\'t display this website, please try another one.',
  Required = 'Enter the URL of the website you wish to scroll.',
}

@UntilDestroy()
@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit {
  @ViewChild('tooltip') errorTooltip: NgbTooltip;
  // tslint:disable-next-line: variable-name
  @Input() set url(value: string) {
    console.log({ value });
    if (value) {
      console.log({ value });

      this.favicon = this.getFavicon(value);
      this.website = value;
    }
  }
  @Input() compactVersion = true;
  @Output() search = new EventEmitter();
  errorTooltipMessage: string;
  errorMessages = ErrorMessages;
  website: string;
  loading: boolean;
  notEmbeddable: boolean;
  hasSearched: boolean;
  isInputFocused: boolean;
  favicon: string;
  shouldShowFavicon = true;

  constructor(private proxyService: ProxyService) {}

  ngOnInit(): void {}

  onSearch(): void {
    this.errorTooltip.close();
    this.shouldShowFavicon = false;
    this.hasSearched = true;
    if (this.website) {
      this.notEmbeddable = false;
      this.loading = true;
      this.proxyService
        .verifyWithProxy(this.website)
        .pipe(untilDestroyed(this))
        .subscribe(({ isEmbeddable, websiteUrl }) => {
          this.loading = false;
          if (isEmbeddable) {
            this.favicon = this.getFavicon(this.website);
            this.search.emit(websiteUrl);
          } else {
            this.notEmbeddable = true;
            this.shouldShowFavicon = false;
            this.errorTooltipMessage = ErrorMessages.Cors;
            this.errorTooltip.open();
          }
        });
    } else {
      this.errorTooltipMessage = ErrorMessages.Required;
      this.errorTooltip.open();
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
