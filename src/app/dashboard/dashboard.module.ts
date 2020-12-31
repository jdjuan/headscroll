import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { LandingComponent } from './dashboard/landing/landing.component';
import { UseCaseComponent } from './dashboard/use-case/use-case.component';
import { PrivacyComponent } from './dashboard/privacy/privacy.component';

@NgModule({
  declarations: [DashboardComponent, LandingComponent, UseCaseComponent, PrivacyComponent],
  imports: [DashboardRoutingModule, CommonModule, MaterialModule],
})
export class DashboardModule {}
