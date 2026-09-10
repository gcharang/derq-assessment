import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'country' })
export class Country {
  @PrimaryColumn({ type: 'text' })
  code: string;

  @Column({ type: 'text' })
  name: string;
}
