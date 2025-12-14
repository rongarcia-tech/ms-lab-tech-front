import { TestBed } from '@angular/core/testing';
import { CoreModule } from './core-module';

describe('CoreModule', () => {
  let module: CoreModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule]
    });
    module = TestBed.inject(CoreModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
