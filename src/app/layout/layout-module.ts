import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainLayout } from './components/main-layout/main-layout';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    MainLayout,
    Header,
    Sidebar,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  exports: [
    MainLayout,
  ]
})
export class LayoutModule {}

