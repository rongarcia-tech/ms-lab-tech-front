import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {

  isMobile = false;
  isTablet = false;
  isDesktop = false;

  sidenavMode: 'over' | 'side' = 'side';
  sidenavOpened = true;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 599px)',                         // mobile
        '(min-width: 600px) and (max-width: 799px)',  // tablet
        '(min-width: 800px)',                         // desktop
      ])
      .subscribe(result => {
        const breakpoints = result.breakpoints;

        this.isMobile = breakpoints['(max-width: 599px)'];
        this.isTablet = breakpoints['(min-width: 600px) and (max-width: 799px)'];
        this.isDesktop = breakpoints['(min-width: 800px)'];

        if (this.isDesktop) {
          // En desktop: header como navegación principal, sidenav secundario
          this.sidenavMode = 'side';
          this.sidenavOpened = false;      // o true si quieres un menú lateral fijo
        } else {
          // En mobile/tablet: navegación principal en el sidenav
          this.sidenavMode = 'over';
          this.sidenavOpened = false;      // se abre con el botón de menú
        }
      });
  }
}
