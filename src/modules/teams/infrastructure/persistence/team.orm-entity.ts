import { Group } from 'src/groups/entities/group.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Standing } from 'src/standings/entities/standing.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm-entity';

@Entity('teams')
export class TeamOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @ManyToMany(() => TournamentOrmEntity, (tournament) => tournament.teams)
  tournaments: TournamentOrmEntity[];

  @ManyToMany(() => Group, (group) => group.teams)
  groups: Group[];

  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches: Match[];

  @OneToMany(() => Standing, (standing) => standing.team)
  standings: Standing[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
