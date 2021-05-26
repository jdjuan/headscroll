import { Component } from '@angular/core';
import { StoreService } from '@core/services/store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {
  constructor(public activeModal: NgbActiveModal, private storeService: StoreService) {}

  done(): void {
    this.activeModal.close();
  }

  updateTutorialStatus(selected: boolean): void {
    if (selected) {
      this.storeService.updateState({ showTutorial: false });
    } else {
      this.storeService.updateState({ showTutorial: true });
    }
  }
}
