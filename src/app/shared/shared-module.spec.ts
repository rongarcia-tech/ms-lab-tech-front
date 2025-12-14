import { TestBed } from '@angular/core/testing';
import { SharedModule } from './shared-module';

describe('SharedModule', () => {
  let module: SharedModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    });
    module = TestBed.inject(SharedModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
