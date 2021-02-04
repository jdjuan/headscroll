import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { IntroductionComponent } from './landing/introduction/introduction.component';
import { UseCaseComponent } from './landing/use-case/use-case.component';
import { PrivacyComponent } from './landing/privacy/privacy.component';
import { BookmarkletComponent } from './landing/bookmarklet/bookmarklet.component';
import { AboutComponent } from './landing/about/about.component';
import { DonationsComponent } from './landing/donations/donations.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LandingComponent,
    IntroductionComponent,
    UseCaseComponent,
    PrivacyComponent,
    BookmarkletComponent,
    AboutComponent,
    DonationsComponent,
  ],
  imports: [DashboardRoutingModule, CommonModule, SharedModule],
})
export class DashboardModule {}
