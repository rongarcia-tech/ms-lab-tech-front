import { Component } from '@angular/core';
import { Subject, startWith, switchMap, catchError, of } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { UserResponse } from '../../../../shared/models/user.models';

@Component({
  selector: 'app-users-page',
  standalone: false,
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage {
  private reload$ = new Subject<void>();

  users$ = this.reload$.pipe(
    startWith(void 0),
    switchMap(() => this.usersService.listUsers()),
    catchError((err) => {
      console.error('[UsersPage] listUsers error', err);
      return of([] as UserResponse[]);
    })
  );

  constructor(private usersService: UserService) {}

  reload(): void { this.reload$.next(); }
}
