import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LabsService } from './lab.service';

describe('Lab', () => {
  let service: LabsService;

  beforeEach(() => {
   TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(LabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
