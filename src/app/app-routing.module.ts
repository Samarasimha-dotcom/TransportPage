import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { PickRideComponent } from './components/pick-ride/pick-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'add-ride', pathMatch: 'full' },
  { path: 'add-ride', component: AddRideComponent },
  { path: 'pick-ride', component: PickRideComponent },
  // { path: 'rides', component: RideListComponent },
  { path: '**', redirectTo: 'add-ride' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
