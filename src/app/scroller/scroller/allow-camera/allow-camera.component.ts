import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './allow-camera.component.html',
  styleUrls: ['./allow-camera.component.scss'],
})
export class AllowCameraComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  done(): void {
    this.activeModal.close();
  }
}
