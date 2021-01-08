import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blocked-camera',
  templateUrl: './blocked-camera.component.html',
  styleUrls: ['./blocked-camera.component.scss'],
})
export class BlockedCameraComponent implements OnInit {
  ngOnInit(): void {}

  done(): void {
    location.reload();
  }
}
