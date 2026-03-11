import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { ItemList } from './features/items/item-list/item-list';
import { CreateItem } from './features/items/create-item/create-item';
import { ItemDetails } from './features/items/item-details/item-details';

import { ClaimItem } from './features/claims/claim-item/claim-item';

import { FormsModule } from '@angular/forms';
import { Landing } from './features/home/landing/landing';
import { Navbar } from './shared/components/navbar/navbar';
import { MyItems } from './features/items/my-items/my-items';

@NgModule({
  declarations: [
    App,
    Landing,
    Login,
    Register,
    ItemList,
    CreateItem,
    ItemDetails,
    ClaimItem,
    Navbar,
    MyItems
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
