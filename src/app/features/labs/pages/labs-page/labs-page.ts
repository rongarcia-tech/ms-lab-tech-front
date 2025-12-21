import { Component } from '@angular/core';
import { Observable, of, Subject , startWith, switchMap} from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { LabsService } from '../../../../core/services/lab.service';
import { LabResponse } from '../../../../shared/models/labs.models';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-labs-page',
  standalone: false,
  templateUrl: './labs-page.html'
})
export class LabsPage {
    private reload$ = new Subject<void>();

  labs$: Observable<LabResponse[]>;
  togglingByLabId: Record<number, boolean> = {};
  roles$: Observable<string[] | null | undefined>;

  constructor(private labsService: LabsService
    , private authService: AuthService
  ) {
    this.roles$ = this.authService.roles$;
    this.labs$ = this.reload$.pipe(
      startWith(void 0),
      switchMap(() => this.labsService.getAllLabs()),
      catchError((err) => {
        console.error('[LabsPage] load labs error', err);
        return of([] as LabResponse[]);
      })
    );
  }
  
   isAdmin(roles: string[] | null | undefined): boolean {
    if (!roles) return false;
    return roles.some(r => (r || '').replace(/^ROLE_/, '') === 'ADMIN');
  }


  reload(): void {
    this.reload$.next();
  }

  toggleActive(lab: LabResponse): void {
    if (!lab?.id) return;

    this.togglingByLabId[lab.id] = true;

    const req$ = lab.active
      ? this.labsService.deactivateLab(lab.id.toString())
      : this.labsService.activateLab(lab.id.toString());

    req$.subscribe({
      next: () => {
        this.togglingByLabId[lab.id] = false;
        this.reload();
      },
      error: (err) => {
        console.error('[LabsPage] toggleActive error', err);
        this.togglingByLabId[lab.id] = false;
      }
    });
  }
}