import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  isInputFocused: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
