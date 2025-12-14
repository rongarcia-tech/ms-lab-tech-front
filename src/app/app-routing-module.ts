import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { LabsPage } from './features/labs/pages/labs-page/labs-page';
import { OrdersPage } from './features/orders/pages/orders-page/orders-page';
import { ProfilePage } from './features/users/pages/profile-page/profile-page';
import { MainLayout } from './layout/components/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth-guard';
import { UsersPage } from './features/users/pages/users-page/users-page';
import { UserFormPage } from './features/users/pages/user-form-page/user-form-page';
import { RolesPage } from './features/users/pages/roles-page/roles-page';
import { LabFormPage } from './features/labs/pages/lab-form-page/lab-form-page';
import { OrderFormPage } from './features/orders/pages/order-form-page/order-form-page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'labs', component: LabsPage },
      { path: 'orders', component: OrdersPage },
      { path: 'profile', component: ProfilePage },
      { path: '', redirectTo: 'labs', pathMatch: 'full' },
      { path: 'admin/users', component: UsersPage },
      { path: 'admin/users/new', component: UserFormPage },
      { path: 'admin/users/:id/edit', component: UserFormPage },
      { path: 'admin/roles', component: RolesPage },

      { path: 'labs/new', component: LabFormPage },
      { path: 'labs/:id/edit', component: LabFormPage },
      { path: 'orders/new', component: OrderFormPage },
      { path: 'orders/:id/assign', component: OrderFormPage },
    ]
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
