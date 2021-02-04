import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webgl-blocked',
  templateUrl: './webgl-blocked.component.html',
  styleUrls: ['./webgl-blocked.component.scss']
})
export class WebglBlockedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  done(): void {
    location.reload();
  }

}
