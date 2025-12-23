import { TestBed } from '@angular/core/testing';
import { ResultsModule } from './results.module';

describe('ResultsModule', () => {
  let module: ResultsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResultsModule]
    });
    module = TestBed.inject(ResultsModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});