import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabsPage } from './pages/labs-page/labs-page';

const routes: Routes = [
  { path: '', component: LabsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabsRoutingModule {}
