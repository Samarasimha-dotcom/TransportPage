import { Injectable } from '@angular/core';
import { Ride, VehicleType } from '../models/ride.model';

@Injectable({ providedIn: 'root' })
export class RideService {
  private readonly STORAGE_KEY_PREFIX = 'rides_';
  private readonly TIME_BUFFER_MINUTES = 60;

  private todayKey(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private storageKeyForToday(): string {
    return this.STORAGE_KEY_PREFIX + this.todayKey();
  }

  private loadTodayRides(): Ride[] {
    const key = this.storageKeyForToday();
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Ride[]) : [];
  }

  private saveTodayRides(rides: Ride[]) {
    const key = this.storageKeyForToday();
    localStorage.setItem(key, JSON.stringify(rides));
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private withinBuffer(target: string, reference: string): boolean {
    const t = this.toMinutes(target);
    const r = this.toMinutes(reference);
    return Math.abs(t - r) <= this.TIME_BUFFER_MINUTES;
  }

  addRide(input: {
    ownerEmployeeId: string;
    vehicleType: VehicleType;
    vehicleNo: string;
    vacantSeats: number;
    time: string; // HH:mm
    pickupPoint: string;
    destination: string;
  }): { ok: true } | { ok: false; error: string } {
    // basic validations
    if (!input.ownerEmployeeId.trim()) return { ok: false, error: 'Employee ID is required' };
    if (!input.vehicleNo.trim()) return { ok: false, error: 'Vehicle No is required' };
    if (!input.pickupPoint.trim()) return { ok: false, error: 'Pick-up Point is required' };
    if (!input.destination.trim()) return { ok: false, error: 'Destination is required' };
    if (!/^\d{2}:\d{2}$/.test(input.time)) return { ok: false, error: 'Time must be HH:mm' };
    if (input.vacantSeats == null || input.vacantSeats < 0) return { ok: false, error: 'Vacant Seats must be >= 0' };

    const rides = this.loadTodayRides();

    // Employee ID unique for ride owners for today
    const existsOwner = rides.some(r => r.ownerEmployeeId === input.ownerEmployeeId);
    if (existsOwner) {
      return { ok: false, error: 'This employee has already added a ride today' };
    }

    const ride: Ride = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      ownerEmployeeId: input.ownerEmployeeId.trim(),
      vehicleType: input.vehicleType,
      vehicleNo: input.vehicleNo.trim(),
      vacantSeats: input.vacantSeats,
      time: input.time,
      pickupPoint: input.pickupPoint.trim(),
      destination: input.destination.trim(),
      bookings: [],
      createdAt: Date.now(),
    };

    rides.push(ride);
    this.saveTodayRides(rides);
    return { ok: true };
  }

  listRides(options?: { vehicleType?: VehicleType | 'All'; timeReference?: string; excludeOwner?: string; onlyWithSeats?: boolean }): Ride[] {
    const rides = this.loadTodayRides();
    let result = rides.slice();

    if (options?.vehicleType && options.vehicleType !== 'All') {
      result = result.filter(r => r.vehicleType === options.vehicleType);
    }

    if (options?.excludeOwner) {
      result = result.filter(r => r.ownerEmployeeId !== options.excludeOwner);
    }

    if (options?.onlyWithSeats) {
      result = result.filter(r => r.vacantSeats > 0);
    }

    // Time matching with +/- 60 minutes if a reference is given, else use current time
    const ref = options?.timeReference || this.currentTimeHHmm();
    result = result.filter(r => this.withinBuffer(r.time, ref));

    // sort by time ascending
    result.sort((a, b) => this.toMinutes(a.time) - this.toMinutes(b.time));

    return result;
  }

  bookRide(rideId: string, employeeId: string): { ok: true } | { ok: false; error: string } {
    if (!employeeId.trim()) return { ok: false, error: 'Employee ID is required' };

    const rides = this.loadTodayRides();
    const idx = rides.findIndex(r => r.id === rideId);
    if (idx === -1) return { ok: false, error: 'Ride not found' };

    const ride = rides[idx];

    if (ride.ownerEmployeeId === employeeId) {
      return { ok: false, error: 'You cannot book your own ride' };
    }

    if (ride.bookings.includes(employeeId)) {
      return { ok: false, error: 'You cannot book the same ride twice' };
    }

    if (ride.vacantSeats <= 0) {
      return { ok: false, error: 'No vacant seats available' };
    }

    ride.bookings.push(employeeId);
    ride.vacantSeats -= 1;

    rides[idx] = ride;
    this.saveTodayRides(rides);
    return { ok: true };
  }

  currentTimeHHmm(): string {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
}
