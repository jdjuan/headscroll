import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-mobile-warning',
  templateUrl: './mobile-warning.component.html',
  styleUrls: ['./mobile-warning.component.scss'],
})
export class MobileWarningComponent {
  constructor(public activeModal: NgbActiveModal, private configService: ConfigService) {}

  done(): void {
    this.activeModal.close();
  }

  updateWarningStatus(selected: boolean): void {
    if (selected) {
      this.configService.stopShowingWarning();
    } else {
      this.configService.keepShowingWarning();
    }
  }
}
