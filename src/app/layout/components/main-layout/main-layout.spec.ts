import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MainLayout } from './main-layout';
import { BreakpointObserver } from '@angular/cdk/layout';

describe('MainLayout', () => {
  function createWithBreakpoints(breakpoints: Record<string, boolean>) {
    // ensure we return a proper BreakpointState shape (includes `matches`)
    const matches = Object.values(breakpoints).some(v => !!v);
    const bpMock: any = {
      observe: () => of({ matches, breakpoints }),
    };

    TestBed.configureTestingModule({
      declarations: [MainLayout],
      providers: [{ provide: BreakpointObserver, useValue: bpMock }],
    });

    // Replace the external template to avoid unknown element errors (app-sidebar, mat-*)
    TestBed.overrideComponent(MainLayout, { set: { template: '<div></div>' } });

    return TestBed.createComponent(MainLayout).componentInstance;
  }

  it('should set desktop layout when desktop breakpoint true', () => {
    const comp = createWithBreakpoints({
      '(max-width: 699px)': false,
      '(min-width: 700px) and (max-width: 799px)': false,
      '(min-width: 800px)': true,
    });

    expect(comp.isDesktop).toBeTrue();
    expect(comp.isMobile).toBeFalse();
    expect(comp.isTablet).toBeFalse();
    expect(comp.sidenavMode).toBe('side');
    expect(comp.sidenavOpened).toBeFalse();
  });

  it('should set mobile layout when mobile breakpoint true', () => {
    const comp = createWithBreakpoints({
      '(max-width: 699px)': true,
      '(min-width: 700px) and (max-width: 799px)': false,
      '(min-width: 800px)': false,
    });

    expect(comp.isMobile).toBeTrue();
    expect(comp.isTablet).toBeFalse();
    expect(comp.isDesktop).toBeFalse();
    expect(comp.sidenavMode).toBe('over');
    expect(comp.sidenavOpened).toBeFalse();
  });

  it('should set tablet layout when tablet breakpoint true', () => {
    const comp = createWithBreakpoints({
      '(max-width: 699px)': false,
      '(min-width: 700px) and (max-width: 799px)': true,
      '(min-width: 800px)': false,
    });

    expect(comp.isTablet).toBeTrue();
    expect(comp.isMobile).toBeFalse();
    expect(comp.isDesktop).toBeFalse();
    expect(comp.sidenavMode).toBe('over');
    expect(comp.sidenavOpened).toBeFalse();
  });
});
