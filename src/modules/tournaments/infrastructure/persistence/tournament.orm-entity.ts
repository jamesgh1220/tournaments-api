import { Phase } from 'src/phase/entities/phase.entity';
import { Standing } from 'src/standings/entities/standing.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';

@Entity('tournaments')
export class TournamentOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 100, default: 'TO_COME' })
  state: string;

  @Column({ type: 'jsonb' })
  configuration: Record<string, any>;

  @Column({ type: 'date' })
  startDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => TeamOrmEntity, (team) => team.tournaments)
  @JoinTable({
    name: 'tournaments_teams',
    joinColumn: { name: 'tournamentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teamId', referencedColumnName: 'id' },
  })
  teams: TeamOrmEntity[];

  @OneToMany(() => Phase, (phase) => phase.tournament)
  phases: Phase[];

  @OneToMany(() => Standing, (standing) => standing.tournament)
  standings: Standing[];
}
