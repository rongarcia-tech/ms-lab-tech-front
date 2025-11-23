import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './components/main-layout/main-layout';

const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'labs',
        loadChildren: () =>
          import('../features/labs/labs-module').then(m => m.LabsModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../features/orders/orders-module').then(m => m.OrdersModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../features/users/users-module').then(m => m.UsersModule),
      },
      {
        path: '',
        redirectTo: 'labs',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
