import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'src/app/core/local-storage.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    this.localStorage.stopShowingTutorial();
  }

  done(): void {
    this.activeModal.close();
  }

  updateTutorialStatus(selected: boolean): void {
    if (selected) {
      this.localStorage.stopShowingTutorial();
    } else {
      this.localStorage.keepShowingTutorial();
    }
  }
}
