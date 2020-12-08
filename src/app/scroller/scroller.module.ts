import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerRoutingModule } from './scroller-routing.module';
import { ScrollerComponent } from './scroller/scroller.component';
import { MaterialModule } from '../material/material.module';
import { SidenavComponent } from './scroller/sidenav/sidenav.component';

@NgModule({
  declarations: [ScrollerComponent, SidenavComponent],
  imports: [
    CommonModule,
    ScrollerRoutingModule,
    MaterialModule
  ]
})
export class ScrollerModule { }
