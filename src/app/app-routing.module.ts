import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule), data: { animation: 'faq' } },
  { path: 'scroller', loadChildren: () => import('./scroller/scroller.module').then((m) => m.ScrollerModule) },
  { path: 'legal', loadChildren: () => import('./legal/legal.module').then((m) => m.LegalModule), data: { animation: 'faq' } },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
