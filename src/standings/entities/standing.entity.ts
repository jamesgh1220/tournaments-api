import { Group } from "src/groups/entities/group.entity";
import { Phase } from "src/phase/entities/phase.entity";
import { Team } from "src/teams/entities/teams.entity";
import { Tournament } from "src/modules/tournaments/domain/entities/tournament.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

@Entity('standings')
export class Standing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.standings)
  tournament: Tournament;

  @ManyToOne(() => Phase, (phase) => phase.standings)
  phase: Phase;

  @ManyToOne(() => Group, (group) => group.standings, {
    nullable: true,
  })
  group: Group;

  @ManyToOne(() => Team, (team) => team.standings)
  team: Team;

  @Column()
  played: number;

  @Column()
  wins: number;

  @Column()
  draws: number;

  @Column()
  losses: number;

  @Column()
  goalsFor: number;

  @Column()
  goalsAgainst: number;

  @Column()
  points: number;
}