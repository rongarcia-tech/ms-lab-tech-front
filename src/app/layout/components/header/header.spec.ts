import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Header } from './header';
import { AuthService } from '../../../core/services/auth';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout'], {
      loggedIn$: of(true)
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [Header],
      imports: [MatMenuTrigger, MatToolbarModule, MatMenuModule, MatDividerModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should initialize showMenuButton as false', () => {
      expect(component.showMenuButton).toBeFalse();
    });

    it('should allow setting showMenuButton', () => {
      component.showMenuButton = true;
      expect(component.showMenuButton).toBeTrue();
    });
  });

  describe('loggedIn$ observable', () => {
    it('should initialize loggedIn$ from authService', (done) => {
      component.loggedIn$.subscribe((isLoggedIn) => {
        expect(isLoggedIn).toBeTrue();
        done();
      });
    });
  });

  describe('openMenu', () => {
    it('should set activeTrigger and open menu', () => {
      const mockTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);

      component.openMenu(mockTrigger);

      expect(component.activeTrigger).toBe(mockTrigger);
      expect(mockTrigger.openMenu).toHaveBeenCalled();
    });

    it('should close previous menu when opening new one', () => {
      const mockTrigger1 = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
      const mockTrigger2 = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);

      component.openMenu(mockTrigger1);
      component.openMenu(mockTrigger2);

      expect(mockTrigger1.closeMenu).toHaveBeenCalled();
      expect(mockTrigger2.openMenu).toHaveBeenCalled();
      expect(component.activeTrigger).toBe(mockTrigger2);
    });

    it('should cancel scheduled close when opening menu', () => {
      const mockTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
      spyOn(component, 'cancelClose');

      component.openMenu(mockTrigger);

      expect(component.cancelClose).toHaveBeenCalled();
    });
  });

  describe('scheduleClose', () => {
    it('should schedule menu close after 150ms', fakeAsync(() => {
      const mockTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
      component.activeTrigger = mockTrigger;

      component.scheduleClose();
      tick(150);

      expect(mockTrigger.closeMenu).toHaveBeenCalled();
    }));

    it('should cancel previous timer', fakeAsync(() => {
      const mockTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
      component.activeTrigger = mockTrigger;

      component.scheduleClose();
      component.scheduleClose();
      tick(150);

      expect(mockTrigger.closeMenu).toHaveBeenCalledTimes(1);
    }));
  });

  describe('cancelClose', () => {
    it('should clear timeout', fakeAsync(() => {
      component.scheduleClose();
      const hasTimer = component['closeTimer'] !== null;
      expect(hasTimer).toBeTrue();

      component.cancelClose();
      expect(component['closeTimer']).toBeNull();

      tick(150);
    }));
  });

  describe('closeActiveMenu', () => {
    it('should close active menu and clear activeTrigger', () => {
      const mockTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
      component.activeTrigger = mockTrigger;

      component.closeActiveMenu();

      expect(mockTrigger.closeMenu).toHaveBeenCalled();
      expect(component.activeTrigger).toBeNull();
    });

    it('should handle case with no active menu', () => {
      component.activeTrigger = null;

      expect(() => component.closeActiveMenu()).not.toThrow();
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to /login', () => {
      component.logout();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('onMenuClick', () => {
    it('should emit menuClick event', () => {
      spyOn(component.menuClick, 'emit');

      component.onMenuClick();

      expect(component.menuClick.emit).toHaveBeenCalled();
    });

    it('should emit menuClick with no data', () => {
      spyOn(component.menuClick, 'emit');

      component.onMenuClick();

      expect(component.menuClick.emit).toHaveBeenCalledWith();
    });
  });
});
