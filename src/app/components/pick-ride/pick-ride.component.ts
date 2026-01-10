import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { Ride, VehicleType } from '../../models/ride.model';

@Component({
  selector: 'app-pick-ride',
  templateUrl: './pick-ride.component.html',
  styleUrls: ['./pick-ride.component.css']
})
export class PickRideComponent implements OnInit {
  vehicleTypes: (VehicleType | 'All')[] = ['All', 'Bike', 'Car'];
  rides: Ride[] = [];
  msg: { type: 'success' | 'error'; text: string } | null = null;

  filterForm = this.fb.group({
    employeeId: [''],
    vehicleType: ['All' as VehicleType | 'All'],
    timeReference: [''], // optional manual time else current time
  });

  constructor(private fb: FormBuilder, private rideService: RideService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    const vt = this.filterForm.value.vehicleType as VehicleType | 'All' | undefined;
    const time = (this.filterForm.value.timeReference || undefined) as string | undefined;
    const emp = (this.filterForm.value.employeeId || '').trim();

    this.rides = this.rideService.listRides({
      vehicleType: vt,
      timeReference: time,
      excludeOwner: emp || undefined,
      onlyWithSeats: true
    });
  }

  book(ride: Ride) {
    this.msg = null;
    const emp = (this.filterForm.value.employeeId || '').trim();
    if (!emp) {
      this.msg = { type: 'error', text: 'Enter your Employee ID to book.' };
      return;
    }
    const res = this.rideService.bookRide(ride.id, emp);
    if (res.ok) {
      this.msg = { type: 'success', text: 'Ride booked successfully!' };
      this.refresh();
    } else {
      this.msg = { type: 'error', text: res.error };
    }
  }
}
