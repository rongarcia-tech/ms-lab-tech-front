import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { LabsService } from '../../../../core/services/lab.service';
import { LabResponse } from '../../../../shared/models/labs.models';

@Component({
  selector: 'app-labs-page',
  standalone: false,
  templateUrl: './labs-page.html'
})
export class LabsPage {
  // ✅ lo que tu template espera
  labs$: Observable<LabResponse[]>;

  constructor(private labsService: LabsService) {
    this.labs$ = this.labsService.getAllLabs().pipe(
      // si falla, no se cae el template
      catchError(() => of([] as LabResponse[])),
      // evita múltiples llamadas si el template se re-renderiza
      shareReplay(1)
    );
  }
}
