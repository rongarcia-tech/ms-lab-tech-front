import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsersRoutingModule } from './users-routing-module';
import { ProfilePage } from './pages/profile-page/profile-page';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
  ]
})
export class UsersModule { }
