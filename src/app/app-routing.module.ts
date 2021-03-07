import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BetaTestGuard } from './core/guards/beta-test.guard';

const routes: Routes = [
  {
    path: '',
    // canActivate: [BetaTestGuard], // TODO
    children: [
      { path: '', loadChildren: () => import('./landing/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'faq', loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule), data: { animation: 'faq' } },
      {
        path: 'scroller',
        loadChildren: () => import('./scroller/scroller.module').then((m) => m.ScrollerModule),
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
