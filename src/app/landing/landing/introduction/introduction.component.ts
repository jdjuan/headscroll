import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent {
  website = '';
  constructor(private router: Router) {}

  search(website: string): void {
    this.router.navigate(['scroller'], { queryParams: { website } });
  }
}
