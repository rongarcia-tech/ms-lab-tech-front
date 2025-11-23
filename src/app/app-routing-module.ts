import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from './features/auth/pages/login-page/login-page';
import { LabsPage } from './features/labs/pages/labs-page/labs-page';
import { OrdersPage } from './features/orders/pages/orders-page/orders-page';
import { ProfilePage } from './features/users/pages/profile-page/profile-page';
import { MainLayout } from './layout/components/main-layout/main-layout';

const routes: Routes = [
  { path: 'login', component: LoginPage },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'labs', component: LabsPage },
      { path: 'orders', component: OrdersPage },
      { path: 'profile', component: ProfilePage },
      { path: '', redirectTo: 'labs', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
