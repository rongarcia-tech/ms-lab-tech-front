import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { ProfilePage } from './pages/profile-page/profile-page';


@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
