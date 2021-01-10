import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @ViewChild('demo') demo: HTMLVideoElement;
  website = '';
  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log(this.demo);
    setTimeout(() => {
      this.demo?.play();
    }, 1000);
  }

  search(website: string): void {
    this.router.navigate(['scroller'], { queryParams: { website } });
  }
}
