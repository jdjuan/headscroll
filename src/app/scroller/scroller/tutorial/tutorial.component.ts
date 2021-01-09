import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.stopShowingTutorial();
  }

  done(): void {
    this.activeModal.close();
  }

  updateTutorialStatus(selected: boolean): void {
    if (selected) {
      this.configService.stopShowingTutorial();
    } else {
      this.configService.keepShowingTutorial();
    }
  }
}
