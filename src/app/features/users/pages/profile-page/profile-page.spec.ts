import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProfilePage } from './profile-page';
import { UserService } from '../../../../core/services/user.service';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on ngOnInit', (done) => {
    const mockUser = {
      id: 1,
      externalId: 'EXT_USER_001',
      username: 'testuser',
      name: 'Test User',
      email: 'test@test.com',
      roles: [{ id: 1, name: 'user', description: 'Regular user' }],
      labCode: 'LAB001',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    userService.getCurrentUser.and.returnValue(of(mockUser as any));

    component.ngOnInit();

    component.user$.subscribe((user) => {
      expect(user).toEqual(jasmine.objectContaining({
        id: mockUser.id,
        externalId: mockUser.externalId,
        username: mockUser.username,
        name: mockUser.name,
        email: mockUser.email,
        labCode: mockUser.labCode,
        active: mockUser.active
      }));
      expect(userService.getCurrentUser).toHaveBeenCalled();
      done();
    });
  });

  it('should initialize user$ observable', () => {
    const mockUser = {
      id: 1,
      externalId: 'EXT_USER_001',
      username: 'testuser',
      name: 'Test User',
      email: 'test@test.com',
      roles: [{ id: 1, name: 'user', description: 'Regular user' }],
      labCode: 'LAB001',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    userService.getCurrentUser.and.returnValue(of(mockUser as any));

    expect(component.user$).toBeUndefined();

    component.ngOnInit();

    expect(component.user$).toBeDefined();
  });
});
