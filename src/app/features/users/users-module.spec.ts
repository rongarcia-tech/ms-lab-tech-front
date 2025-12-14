import { TestBed } from '@angular/core/testing';
import { UsersModule } from './users-module';

describe('UsersModule', () => {
  let module: UsersModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersModule]
    });
    module = TestBed.inject(UsersModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
