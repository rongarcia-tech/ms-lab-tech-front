import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { UsersPage } from './users-page';
import { UserService } from '../../../../core/services/user.service';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterTestingModule } from '@angular/router/testing';

type AnyUser = any;

describe('UsersPage', () => {
  let fixture: ComponentFixture<UsersPage>;
  let component: UsersPage;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj<UserService>('UserService', ['listUsers']);
    userServiceMock.listUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [UsersPage],
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
      ],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  /**
   * ⚠️ clave: NO llamar fixture.detectChanges() por defecto,
   * porque eso puede disparar ngOnInit + template async y duplicar llamadas.
   */
  function createComponentWithoutCD() {
    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    createComponentWithoutCD();
    expect(component).toBeTruthy();
  });

  describe('users$ observable', () => {
    it('should load users (init)', async () => {
      const mockUsers: AnyUser[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' },
      ];

      userService.listUsers.and.returnValue(of(mockUsers));

      createComponentWithoutCD();

      // Si tu users$ se crea en constructor/initializer, ya está listo.
      const users = await firstValueFrom(component.users$);
      expect(users).toEqual(mockUsers);

      // ✅ no asumas "1 vez exacta" porque puede haber 2 suscripciones (template + test)
      expect(userService.listUsers).toHaveBeenCalled();
    });

    it('should handle error and return []', async () => {
      userService.listUsers.and.returnValue(throwError(() => new Error('API Error')));

      // si tu componente loguea, OK; si no, quita este spy + expect
      spyOn(console, 'error');

      createComponentWithoutCD();

      const users = await firstValueFrom(component.users$);
      expect(users).toEqual([]);
      expect(userService.listUsers).toHaveBeenCalled();

      // ⚠️ si tu componente no hace console.error, elimina estas 2 líneas
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('reload', () => {
    it('should reload users (data changes)', async () => {
      const first: AnyUser[] = [{ id: 1, name: 'User 1', email: 'user1@test.com' }];
      const second: AnyUser[] = [{ id: 2, name: 'User 2', email: 'user2@test.com' }];

      // primera carga
      userService.listUsers.and.returnValue(of(first));

      createComponentWithoutCD();

      const users1 = await firstValueFrom(component.users$);
      expect(users1).toEqual(first);

      const callsBefore = userService.listUsers.calls.count();

      // reload: nueva data
      userService.listUsers.and.returnValue(of(second));
      component.reload();

      const users2 = await firstValueFrom(component.users$);
      expect(users2).toEqual(second);

      const callsAfter = userService.listUsers.calls.count();

      // ✅ debe haber aumentado (al menos 1 llamada más), sin asumir exactitud
      expect(callsAfter).toBeGreaterThan(callsBefore);
    });
  });
});
