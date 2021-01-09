import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  scrollSpeed: number;

  constructor(private configService: ConfigService) {}
  ngOnInit(): void {
    this.configService.scrollSpeed.subscribe((speed) => {
      this.scrollSpeed = speed;
    });
  }

  speedChange(): void {
    this.configService.updateSpeed(this.scrollSpeed);
  }
}
