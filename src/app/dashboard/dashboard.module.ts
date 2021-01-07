import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LandingComponent } from './dashboard/landing/landing.component';
import { UseCaseComponent } from './dashboard/use-case/use-case.component';
import { PrivacyComponent } from './dashboard/privacy/privacy.component';
import { BookmarkletComponent } from './dashboard/bookmarklet/bookmarklet.component';
import { AboutComponent } from './dashboard/about/about.component';
import { DonationsComponent } from './dashboard/donations/donations.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    LandingComponent,
    UseCaseComponent,
    PrivacyComponent,
    BookmarkletComponent,
    AboutComponent,
    DonationsComponent,
  ],
  imports: [DashboardRoutingModule, CommonModule, SharedModule],
})
export class DashboardModule {}
