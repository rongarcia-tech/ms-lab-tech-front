import { Component } from '@angular/core';
import { RolesService } from '../../../../core/services/roles.service';
import { RoleResponse } from '../../../../shared/models/role.models';
import {  Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-roles-page',
  standalone: false,
  templateUrl: './roles-page.html',
  styleUrl: './roles-page.scss'
})
export class RolesPage {
  roles$!: Observable<RoleResponse[]>;
  
constructor(private rolesService: RolesService) {
    this.roles$ = this.rolesService.listRoles().pipe(
      catchError(err => {
        console.error('[RolesPage] roles error', err);
        return of([] as RoleResponse[]);
      })
    );
  }
}
