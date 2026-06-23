import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PhaseOrmEntity } from './phase.orm-entity';

@Entity('phase_type')
export class PhaseTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PhaseOrmEntity, (phase_type) => phase_type.type)
  phases: PhaseOrmEntity[];
}
