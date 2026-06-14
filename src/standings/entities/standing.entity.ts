import { Group } from "src/groups/entities/group.entity";
import { Phase } from "src/phase/entities/phase.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { TournamentOrmEntity } from "src/modules/tournaments/infrastructure/persistence/tournament.orm-entity";
import { TeamOrmEntity } from "src/modules/teams/infrastructure/persistence/team.orm-entity";

@Entity('standings')
export class Standing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TournamentOrmEntity, (tournament) => tournament.standings)
  tournament: TournamentOrmEntity;

  @ManyToOne(() => Phase, (phase) => phase.standings)
  phase: Phase;

  @ManyToOne(() => Group, (group) => group.standings, {
    nullable: true,
  })
  group: Group;

  @ManyToOne(() => TeamOrmEntity, (team) => team.standings)
  team: TeamOrmEntity;

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
