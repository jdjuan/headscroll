import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit {
  @Input() availableCameras: MediaDeviceInfo[] = [];
  @Input() showSkeleton: boolean;
  @Output() changeCamera = new EventEmitter<string>();
  @Output() toggleSkeleton = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onChangeCamera(deviceId: string): void {
    this.changeCamera.emit(deviceId);
  }

  onToggleSkeleton(): void {
    this.toggleSkeleton.emit();
  }
}
