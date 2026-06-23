import { Group } from 'src/groups/entities/group.entity';
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
import { MatchOrmEntity } from 'src/modules/matches/infrastructure/persistence/match.orm-entity';

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

  @OneToMany(() => MatchOrmEntity, (match) => match.homeTeam)
  homeMatches: MatchOrmEntity[];

  @OneToMany(() => MatchOrmEntity, (match) => match.awayTeam)
  awayMatches: MatchOrmEntity[];

  @OneToMany(() => Standing, (standing) => standing.team)
  standings: Standing[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
