import { Group } from 'src/groups/entities/group.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm-entity';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';
import { PhaseOrmEntity } from 'src/modules/phase/infrastructure/persistence/phase.orm-entity';

@Entity('standings')
export class StandingOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tournamentId: number;
  @ManyToOne(() => TournamentOrmEntity, (tournament) => tournament.standings)
  tournament: TournamentOrmEntity;

  @Column()
  phaseId: number;
  @ManyToOne(() => PhaseOrmEntity, (phase) => phase.standings)
  phase: PhaseOrmEntity;

  @Column()
  groupId: number;
  @ManyToOne(() => Group, (group) => group.standings, {
    nullable: true,
  })
  group: Group;

  @Column()
  teamId: number;
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
