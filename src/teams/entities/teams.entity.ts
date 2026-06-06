import { Group } from 'src/groups/entities/group.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Standing } from 'src/standings/entities/standing.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @ManyToMany(() => Tournament, (tournament) => tournament.teams)
  tournaments: Tournament[];

  @ManyToMany(() => Group, (group) => group.teams)
  groups: Group[];

  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches: Match[];

  @OneToMany(() => Standing, (standing) => standing.team)
  standings: Standing[];
}
