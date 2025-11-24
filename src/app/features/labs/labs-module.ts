import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//import { LabsRoutingModule } from './labs-routing-module';
import { LabsPage } from './pages/labs-page/labs-page';
import { LabsList } from './components/labs-list/labs-list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    LabsPage,
    LabsList
  ],
  imports: [
    CommonModule,
   // LabsRoutingModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class LabsModule { }
