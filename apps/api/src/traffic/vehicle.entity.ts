import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'vehicle' })
export class Vehicle {
  @PrimaryColumn({ type: 'text' })
  code: string;

  @Column({ type: 'text' })
  name: string;
}
