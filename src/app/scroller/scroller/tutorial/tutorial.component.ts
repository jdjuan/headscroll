import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'src/app/core/services/state.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {
  constructor(public activeModal: NgbActiveModal, private stateService: StateService) {}

  done(): void {
    this.activeModal.close();
  }

  updateTutorialStatus(selected: boolean): void {
    if (selected) {
      this.stateService.updateState({ showTutorial: false });
    } else {
      this.stateService.updateState({ showTutorial: true });
    }
  }
}
