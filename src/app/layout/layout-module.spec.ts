import { TestBed } from '@angular/core/testing';
import { LayoutModule } from './layout-module';

describe('LayoutModule', () => {
  let module: LayoutModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutModule]
    });
    module = TestBed.inject(LayoutModule);
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});
