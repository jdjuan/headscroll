import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'src/app/core/state.service';

@Component({
  selector: 'app-mobile-warning',
  templateUrl: './mobile-warning.component.html',
  styleUrls: ['./mobile-warning.component.scss'],
})
export class MobileWarningComponent {
  constructor(public activeModal: NgbActiveModal, private stateService: StateService) {}

  done(): void {
    this.activeModal.close();
  }

  updateWarningStatus(selected: boolean): void {
    if (selected) {
      this.stateService.updateState({ showMobileWarning: false });
    } else {
      this.stateService.updateState({ showMobileWarning: true });
    }
  }
}
