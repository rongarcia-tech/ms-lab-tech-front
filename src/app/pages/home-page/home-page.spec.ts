import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HomePage } from './home-page';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [RouterTestingModule, MatIconModule, MatCardModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goToLogin', () => {
    it('should navigate to login without redirectTo param', () => {
      spyOn(router, 'navigate');

      component.goToLogin();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to login with redirectTo query param', () => {
      spyOn(router, 'navigate');

      component.goToLogin('/labs');

      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { redirectTo: '/labs' }
      });
    });

    it('should navigate to login with different redirectTo path', () => {
      spyOn(router, 'navigate');

      component.goToLogin('/orders');

      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { redirectTo: '/orders' }
      });
    });
  });
});
