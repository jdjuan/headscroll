import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  website = '';
  constructor(private router: Router) {}

  search(website: string): void {
    this.router.navigate(['scroller'], { queryParams: { website } });
  }
}
