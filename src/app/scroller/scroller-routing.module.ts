import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScrollerComponent } from './scroller/scroller.component';

const routes: Routes = [{ path: '', component: ScrollerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrollerRoutingModule { }
