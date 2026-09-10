import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Country } from './country.entity.js';
import { Vehicle } from './vehicle.entity.js';

@Entity({ name: 'traffic_observation' })
export class TrafficObservation {
  @PrimaryColumn({ name: 'country_code', type: 'text' })
  countryCode: string;

  @PrimaryColumn({ name: 'vehicle_code', type: 'text' })
  vehicleCode: string;

  @PrimaryColumn({ type: 'smallint' })
  year: number;

  @Column({ type: 'double precision' })
  value: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_code' })
  country: Country;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_code' })
  vehicle: Vehicle;
}
