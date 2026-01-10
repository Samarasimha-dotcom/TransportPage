export type VehicleType = 'Bike' | 'Car';

export interface Ride {
  id: string; // unique ride id
  ownerEmployeeId: string; // employee who offers the ride (unique per day)
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  time: string; // HH:mm (24h)
  pickupPoint: string;
  destination: string;
  bookings: string[]; // employee IDs who booked
  createdAt: number; // epoch ms when created (used to ensure current day)
}
