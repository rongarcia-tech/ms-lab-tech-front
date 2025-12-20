import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { ResultsPage } from './results-page';
import { ResultsService } from '../../../../core/services/results.service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;
  let resultsService: jasmine.SpyObj<ResultsService>;

  beforeEach(async () => {
    const resultsServiceMock = jasmine.createSpyObj('ResultsService', ['getAllResults', 'deleteResult']);
    resultsServiceMock.getAllResults.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ResultsPage],
      imports: [MatCardModule, MatChipsModule],
      providers: [{ provide: ResultsService, useValue: resultsServiceMock }],
    }).compileComponents();

    resultsService = TestBed.inject(ResultsService) as jasmine.SpyObj<ResultsService>;
    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('results$ observable', () => {
    it('should load results', (done) => {
      const mock = [
        { externalId: 'R1', patientId: 'P1', orderExternalId: 'O1', status: 'PENDING' },
        { externalId: 'R2', patientId: 'P2', orderExternalId: 'O2', status: 'FINAL' },
      ];

      resultsService.getAllResults.and.returnValue(of(mock as any));

      component.results$.pipe(take(1)).subscribe((items) => {
        expect(items).toEqual(mock as any);
        expect(resultsService.getAllResults).toHaveBeenCalled();
        done();
      });

      fixture.detectChanges();
    });

    it('should handle error loading results', (done) => {
      resultsService.getAllResults.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error');

      component.results$.pipe(take(1)).subscribe((items) => {
        expect(items).toEqual([]);
        expect(console.error).toHaveBeenCalled();
        done();
      });

      fixture.detectChanges();
    });
  });

  describe('reload', () => {
    it('should reload results', () => {
      const first = [{ externalId: 'R1' }];
      const second = [{ externalId: 'R2' }];

      resultsService.getAllResults.and.returnValue(of(first as any));
      fixture.detectChanges();

      const callsBefore = resultsService.getAllResults.calls.count();

      resultsService.getAllResults.and.returnValue(of(second as any));
      component.reload();

      const callsAfter = resultsService.getAllResults.calls.count();
      expect(callsAfter).toBeGreaterThan(callsBefore);
    });
  });

  describe('getStatusChipColor', () => {
    it('should return primary for FINAL', () => {
      expect(component.getStatusChipColor('FINAL')).toBe('primary');
    });

    it('should return accent for PENDING', () => {
      expect(component.getStatusChipColor('PENDING')).toBe('accent');
    });

    it('should return warn for CANCELLED', () => {
      expect(component.getStatusChipColor('CANCELLED')).toBe('warn');
    });

    it('should return accent for unknown', () => {
      expect(component.getStatusChipColor('UNKNOWN')).toBe('accent');
    });
  });

  describe('deleteResult', () => {
    it('should call service.deleteResult and reload on success', () => {
      resultsService.deleteResult.and.returnValue(of(void 0));
      resultsService.getAllResults.and.returnValue(of([] as any));

      const reloadSpy = spyOn(component, 'reload').and.callThrough();

      component.deleteResult('R1');

      expect(resultsService.deleteResult).toHaveBeenCalledWith('R1');
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should handle delete error', () => {
      resultsService.deleteResult.and.returnValue(throwError(() => new Error('API Error')));
      const errSpy = spyOn(console, 'error');

      component.deleteResult('R1');

      expect(errSpy).toHaveBeenCalled();
    });
  });
});
