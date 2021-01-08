import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() title: string;
  @Input() buttonText: string;
  @Input() link: string;
  @Input() linkText: string;
  @Input() assetName: string;
  @Input() altText: string;
  @Input() compact = false;
  @Output() proceed = new EventEmitter();

  onProceed(): void {
    this.proceed.emit();
  }
}
