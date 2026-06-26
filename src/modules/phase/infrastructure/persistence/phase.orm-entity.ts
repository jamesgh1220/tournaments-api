import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PhaseTypeOrmEntity } from './phase-type.orm-entity';
import { Group } from 'src/groups/entities/group.entity';
import { StandingOrmEntity } from 'src/modules/standings/infrastructure/persistence/standing.orm-entity';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm-entity';
import { MatchOrmEntity } from 'src/modules/matches/infrastructure/persistence/match.orm-entity';

@Entity('phases')
export class PhaseOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, default: 'TO_COME' })
  status: string;

  @Column()
  order_number: number;

  @Column()
  tournamentId: number;
  @ManyToOne(() => TournamentOrmEntity, (tournament) => tournament.phases)
  @JoinColumn({ name: 'tournamentId' })
  tournament: TournamentOrmEntity;

  @Column()
  typeId: number;
  @ManyToOne(() => PhaseTypeOrmEntity, (type) => type.phases)
  @JoinColumn({ name: 'typeId' })
  type: PhaseTypeOrmEntity;

  @OneToMany(() => Group, (group) => group.phase)
  groups: Group[];

  @OneToMany(() => MatchOrmEntity, (match) => match.phase)
  matches: MatchOrmEntity[];

  @OneToMany(() => StandingOrmEntity, (standing) => standing.phase)
  standings: StandingOrmEntity[];
}
