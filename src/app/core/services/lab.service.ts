import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LabResponse } from '../../shared/models/labs.models';
import { MOCK_LABS } from '../../shared/mocks/labs.mocks';

@Injectable({
  providedIn: 'root',
})
export class LabsService {
  constructor() {}

  getAllLabs(): Observable<LabResponse[]> {
    // Futuro: HTTP GET a /labs (ms_lab en puerto 8081)
    return of(MOCK_LABS);
  }
}

