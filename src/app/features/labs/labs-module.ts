import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabsRoutingModule } from './labs-routing-module';
import { LabsPage } from './pages/labs-page/labs-page';
import { LabsList } from './components/labs-list/labs-list';


@NgModule({
  declarations: [
    LabsPage,
    LabsList
  ],
  imports: [
    CommonModule,
    LabsRoutingModule
  ]
})
export class LabsModule { }
