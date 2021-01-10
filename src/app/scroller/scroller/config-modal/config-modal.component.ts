import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.scss'],
})
export class ConfigModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
  done(e: Event): void {
    e.preventDefault();
    this.activeModal.close();
  }
}
