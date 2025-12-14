import { TestBed } from '@angular/core/testing';
import { LabsModule } from './labs-module';

describe('LabsModule', () => {
  let module: LabsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LabsModule]
    });
    module = TestBed.inject(LabsModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
