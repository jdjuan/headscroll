import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from 'src/app/core/services/store.service';

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
