import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { StoreService } from 'src/app/core/services/store.service';
import { slideInAnimation } from './shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent {
  constructor(private proxyService: ProxyService, private store: StoreService) {
    this.proxyService.fetchWhitelist().subscribe();
    this.store.select((state) => state.whitelist).subscribe(console.log);
  }

  prepareRoute(outlet: RouterOutlet): boolean {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
