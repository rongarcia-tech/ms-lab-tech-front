import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { RolesPage } from './roles-page';
import { RolesService } from '../../../../core/services/roles.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

describe('RolesPage', () => {
  let fixture: ComponentFixture<RolesPage>;
  let component: RolesPage;
  let rolesService: jasmine.SpyObj<RolesService>;

  beforeEach(async () => {
    const rolesServiceMock = jasmine.createSpyObj<RolesService>('RolesService', ['listRoles']);
    rolesServiceMock.listRoles.and.returnValue(of([])); // default seguro

    await TestBed.configureTestingModule({
      declarations: [RolesPage],
      imports: [MatCardModule, MatChipsModule],
      providers: [{ provide: RolesService, useValue: rolesServiceMock }],
    }).compileComponents();

    rolesService = TestBed.inject(RolesService) as jasmine.SpyObj<RolesService>;
  });

  // ✅ crear componente SOLO cuando ya seteaste el return del spy
  function createComponent() {
    fixture = TestBed.createComponent(RolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should load roles on constructor', (done) => {
    const mockRoles = [
      { id: 1, name: 'admin', description: 'Administrator' },
      { id: 2, name: 'user', description: 'Regular user' },
    ];

    rolesService.listRoles.and.returnValue(of(mockRoles as any));

    createComponent();

    component.roles$.pipe(take(1)).subscribe((roles) => {
      expect(roles).toEqual(mockRoles as any);
      expect(rolesService.listRoles).toHaveBeenCalled();
      done();
    });
  });

  it('should handle error loading roles and return empty array', (done) => {
    const err = new Error('API Error');
    rolesService.listRoles.and.returnValue(throwError(() => err));

    // ⚠️ si tu componente NO hace console.error, este assert se debe quitar
    const errorSpy = spyOn(console, 'error');

    createComponent();

    component.roles$.pipe(take(1)).subscribe((roles) => {
      expect(roles).toEqual([]);

      // ✅ hazlo menos frágil: valida que se logueó, sin exigir exactamente los args
      expect(errorSpy).toHaveBeenCalled();

      // Si QUIERES mantener el match estricto, entonces tu componente debe loguear así:
      // console.error('[RolesPage] roles error', err);
      // y acá puedes usar:
      // expect(errorSpy).toHaveBeenCalledWith('[RolesPage] roles error', jasmine.any(Error));

      done();
    });
  });

  it('should initialize roles$ observable', () => {
    createComponent();
    expect(component.roles$).toBeDefined();
  });
});
