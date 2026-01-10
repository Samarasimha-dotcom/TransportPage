import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { VehicleType } from '../../models/ride.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.css']
})
export class AddRideComponent {
  vehicleTypes: VehicleType[] = ['Bike', 'Car'];
  msg: { type: 'success' | 'error'; text: string } | null = null;

  form = this.fb.group({
    ownerEmployeeId: ['', [Validators.required]],
    vehicleType: ['Bike' as VehicleType, [Validators.required]],
    vehicleNo: ['', [Validators.required]],
    vacantSeats: [1, [Validators.required, Validators.min(0)]],
    time: ['', [Validators.required]],
    pickupPoint: ['', [Validators.required]],
    destination: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private rideService: RideService, private router: Router) { }

  submit() {
    this.msg = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.msg = { type: 'error', text: 'Please fill all required fields correctly.' };
      return;
    }

    const res = this.rideService.addRide({
      ownerEmployeeId: this.form.value.ownerEmployeeId!,
      vehicleType: this.form.value.vehicleType!,
      vehicleNo: this.form.value.vehicleNo!,
      vacantSeats: this.form.value.vacantSeats!,
      time: this.form.value.time!,
      pickupPoint: this.form.value.pickupPoint!,
      destination: this.form.value.destination!,
    });

    if (res.ok) {
      this.msg = { type: 'success', text: 'Ride added successfully for today!' };
      this.form.reset({ vehicleType: 'Bike', vacantSeats: 1 });
      this.router.navigate(['/pick-ride']);
    } else {
      this.msg = { type: 'error', text: res.error };
    }
  }
}
