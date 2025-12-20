import { Component } from '@angular/core';
import { Subject, startWith, switchMap, catchError, of } from 'rxjs';
import { ResultsService } from '../../../../core/services/results.service';
import { LabResultResponse } from '../../../../shared/models/results.models';

@Component({
  selector: 'app-results-page',
  standalone: false,
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss',
})
export class ResultsPage {
  private reload$ = new Subject<void>();

  results$ = this.reload$.pipe(
    startWith(void 0),
    switchMap(() => this.resultsService.getAllResults()),
    catchError((err) => {
      console.error('[ResultsPage] load error', err);
      return of([] as LabResultResponse[]);
    })
  );

  constructor(private resultsService: ResultsService) {}

  reload(): void {
    this.reload$.next();
  }

  getStatusChipColor(status: string): 'primary' | 'accent' | 'warn' | 'success' {
    switch (status) {
      case 'FINAL':
        return 'primary';
      case 'PENDING':
        return 'accent';
      case 'CANCELLED':
        return 'warn';
      default:
        return 'accent';
    }
  }

  deleteResult(externalId: string): void {
    this.resultsService.deleteResult(externalId).subscribe({
      next: () => this.reload(),
      error: (err) => console.error('[ResultsPage] deleteResult error', err),
    });
  }
}
