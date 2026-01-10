import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Ride, VehicleType } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RideListComponent implements OnInit {
  vehicleTypes: Array<VehicleType | 'All'> = ['All', 'Bike', 'Car'];

  filters = this.fb.group({
    search: [''],
    vehicleType: ['All' as VehicleType | 'All'],
    onlyWithSeats: [false],
    timeReference: ['']
  });

  rides: Ride[] = [];

  constructor(private fb: FormBuilder, private rideService: RideService) {}

  ngOnInit(): void {
    this.apply();
    this.filters.valueChanges.subscribe(() => this.apply());
  }

  private apply() {
    const f = this.filters.value;
    const base = this.rideService.listRides({
      vehicleType: (f.vehicleType as any) || 'All',
      timeReference: f.timeReference || undefined,
      onlyWithSeats: !!f.onlyWithSeats,
    });

    const term = (f.search || '').toString().trim().toLowerCase();
    this.rides = term
      ? base.filter(r =>
          r.ownerEmployeeId.toLowerCase().includes(term) ||
          r.vehicleNo.toLowerCase().includes(term) ||
          r.pickupPoint.toLowerCase().includes(term) ||
          r.destination.toLowerCase().includes(term)
        )
      : base;
  }
}
