import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { LandingComponent } from './dashboard/landing/landing.component';
import { UseCaseComponent } from './dashboard/use-case/use-case.component';
import { PrivacyComponent } from './dashboard/privacy/privacy.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BookmarkletComponent } from './dashboard/bookmarklet/bookmarklet.component';
import { AboutComponent } from './dashboard/about/about.component';
import { DonationsComponent } from './dashboard/donations/donations.component';

@NgModule({
  declarations: [DashboardComponent, LandingComponent, UseCaseComponent, PrivacyComponent, BookmarkletComponent, AboutComponent, DonationsComponent],
  imports: [DashboardRoutingModule, FormsModule, CommonModule, MaterialModule, NgbTooltipModule],
})
export class DashboardModule {}
