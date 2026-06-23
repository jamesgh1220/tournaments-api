import { Group } from 'src/groups/entities/group.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';
import { PhaseOrmEntity } from 'src/modules/phase/infrastructure/persistence/phase.orm-entity';

@Entity('matches')
export class MatchOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phaseId: number;
  @ManyToOne(() => PhaseOrmEntity, (phase) => phase.matches)
  phase: PhaseOrmEntity;

  @Column({ nullable: true })
  groupId?: number;
  @ManyToOne(() => Group, (group) => group.matches, {
    nullable: true,
  })
  group: Group;

  @Column()
  homeTeamId: number;
  @ManyToOne(() => TeamOrmEntity, (team) => team.homeMatches)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: TeamOrmEntity;

  @Column()
  awayTeamId: number;
  @ManyToOne(() => TeamOrmEntity, (team) => team.awayMatches)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: TeamOrmEntity;

  @Column()
  homeScore: number;

  @Column()
  awayScore: number;

  @Column({ default: 'TO_COME' })
  status: string;

  @Column({ type: 'date' })
  scheduledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
