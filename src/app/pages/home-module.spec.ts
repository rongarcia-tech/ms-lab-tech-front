import { TestBed } from '@angular/core/testing';
import { HomeModule } from './home-module';

describe('HomeModule', () => {
  let module: HomeModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeModule]
    });
    module = TestBed.inject(HomeModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
