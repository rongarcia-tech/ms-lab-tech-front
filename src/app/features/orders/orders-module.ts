import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing-module';
import { OrdersPage } from './pages/orders-page/orders-page';
import { OrdersList } from './components/orders-list/orders-list';


@NgModule({
  declarations: [
    OrdersPage,
    OrdersList
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
