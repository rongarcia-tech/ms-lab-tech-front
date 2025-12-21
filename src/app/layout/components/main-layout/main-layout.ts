import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

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

  private readonly MOBILE = '(max-width: 699px)'; // <= 699
  private readonly TABLET = '(min-width: 700px) and (max-width: 799px)'; // 700-799
  private readonly DESKTOP = '(min-width: 800px)'; // >= 800

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([this.MOBILE, this.TABLET, this.DESKTOP])
      .subscribe(result => {
        const b = result.breakpoints;

        this.isMobile = !!b[this.MOBILE];
        this.isTablet = !!b[this.TABLET];
        this.isDesktop = !!b[this.DESKTOP];

        if (this.isDesktop) {
          this.sidenavMode = 'side';
          this.sidenavOpened = false; // o true si quieres fijo
        } else {
          this.sidenavMode = 'over';
          this.sidenavOpened = false;
        }
      });
  }
}
