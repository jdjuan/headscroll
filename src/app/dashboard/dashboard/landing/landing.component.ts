import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProxyService } from 'src/app/core/proxy.service';

@UntilDestroy()
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  isInputFocused: boolean;
  website = '';
  // website = 'https://tabs.ultimate-guitar.com/tab/avi-kaplan/change-on-the-rise-chords-2691219';
  hasSearched: boolean;
  notEmbeddable: boolean;
  loading: boolean;

  constructor(private router: Router, private proxyService: ProxyService) {}

  ngOnInit(): void {}

  search(): void {
    this.hasSearched = true;
    if (this.website) {
      this.notEmbeddable = false;
      this.loading = true;
      this.proxyService
        .verifyWithProxy(this.website)
        .pipe(untilDestroyed(this))
        .subscribe(({ isEmbeddable }) => {
          this.loading = false;
          if (isEmbeddable) {
            this.router.navigate(['scroller'], { queryParams: { website: this.website } });
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
