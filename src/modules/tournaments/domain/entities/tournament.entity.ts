import { Phase } from 'src/phase/entities/phase.entity';
import { Standing } from 'src/standings/entities/standing.entity';
import { Team } from 'src/teams/entities/teams.entity';

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

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 100, default: 'TO_COME' })
  state: string;

  @Column({
    type: 'jsonb',
  })
  configuration: Record<string, any>;

  @Column({
    type: 'date',
  })
  startDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Team, (team) => team.tournaments)
  @JoinTable({
    name: 'tournaments_teams',
    joinColumn: {
      name: 'tournamentId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'teamId',
      referencedColumnName: 'id',
    },
  })
  teams: Team[];

  @OneToMany(() => Phase, (phase) => phase.tournament)
  phases: Phase[];

  @OneToMany(() => Standing, (standing) => standing.tournament)
  standings: Standing[];

  static create(
    name: string,
    state: string,
    configuration: object,
    startDate: Date,
  ): Tournament {
    const tournament = new Tournament();
    tournament.name = name;
    tournament.state = state || 'TO_COME';
    tournament.configuration = configuration;
    tournament.startDate = startDate;
    return tournament;
  }
}
