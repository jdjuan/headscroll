import { Component } from '@angular/core';
import { StoreService } from '@core/services/store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mobile-warning',
  templateUrl: './mobile-warning.component.html',
  styleUrls: ['./mobile-warning.component.scss'],
})
export class MobileWarningComponent {
  constructor(public activeModal: NgbActiveModal, private storeService: StoreService) {}

  done(): void {
    this.activeModal.close();
  }

  updateWarningStatus(selected: boolean): void {
    if (selected) {
      this.storeService.updateState({ showMobileWarning: false });
    } else {
      this.storeService.updateState({ showMobileWarning: true });
    }
  }
}
