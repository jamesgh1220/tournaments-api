import { Tournament } from "src/tournaments/entities/tournament.entity";
import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PhaseType } from "./phase-type.entity";
import { Group } from "src/groups/entities/group.entity";
import { Match } from "src/matches/entities/match.entity";
import { Standing } from "src/standings/entities/standing.entity";

@Entity('phases')
export class Phase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, default: 'PENDING' })
  status: string;

  @Column()
  order_number:number;

  @ManyToOne(() => Tournament, (tournament) => tournament.phases)
  tournament: Tournament;

  @ManyToOne(() => PhaseType, (type) => type.phases)
  type: PhaseType;

  @OneToMany(() => Group, (group) => group.phase)
  groups: Group[];

  @OneToMany(() => Match, (match) => match.phase)
  matches: Match[];

  @OneToMany(() => Standing, (standing) => standing.phase)
  standings: Standing[];
}
