 import { NgModule } from '@angular/core';
 import { BrowserModule } from '@angular/platform-browser';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { AppRoutingModule } from './app-routing.module';
 
 import { AppComponent } from './app.component';
 import { AddRideComponent } from './components/add-ride/add-ride.component';
 import { PickRideComponent } from './components/pick-ride/pick-ride.component';

 @NgModule({
   declarations: [
     AppComponent,
     AddRideComponent,
     PickRideComponent
   ],
   imports: [
     BrowserModule,
     FormsModule,
     ReactiveFormsModule,
     AppRoutingModule
   ],
   providers: [],
   bootstrap: [AppComponent]
 })
 export class AppModule { }
