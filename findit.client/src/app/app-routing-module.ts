import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { ItemList } from './features/items/item-list/item-list';
import { CreateItem } from './features/items/create-item/create-item';
import { ItemDetails } from './features/items/item-details/item-details';

import { ClaimItem } from './features/claims/claim-item/claim-item';
import { Landing } from './features/home/landing/landing';

const routes: Routes = [

  { path: '', component: Landing },

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  { path: 'dashboard', component: ItemList },

  { path: 'create-item', component: CreateItem },

  { path: 'item/:id', component: ItemDetails },

  { path: 'claim/:itemId', component: ClaimItem }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
