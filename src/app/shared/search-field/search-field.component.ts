import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProxyService } from 'src/app/core/proxy.service';

@UntilDestroy()
@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit {
  @Output() search = new EventEmitter();
  website: string;
  loading: boolean;
  notEmbeddable: boolean;
  hasSearched: boolean;
  isInputFocused: boolean;

  constructor(private proxyService: ProxyService) {}

  ngOnInit(): void {}

  onSearch(): void {
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
            this.search.emit(websiteUrl);
          } else {
            this.notEmbeddable = true;
          }
        });
    }
  }

  cleanValidation(): void {
    this.notEmbeddable = false;
  }
}
