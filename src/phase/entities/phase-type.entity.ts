import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Phase } from './phase.entity';

@Entity('phase_type')
export class PhaseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Phase, (phase_type) => phase_type.type)
  phases: Phase[];
}
