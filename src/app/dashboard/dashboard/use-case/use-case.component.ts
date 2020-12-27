import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-use-case',
  templateUrl: './use-case.component.html',
  styleUrls: ['./use-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UseCaseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
