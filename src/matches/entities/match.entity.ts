import { Group } from 'src/groups/entities/group.entity';
import { Phase } from 'src/phase/entities/phase.entity';
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

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Phase, (phase) => phase.matches)
  phase: Phase;

  @ManyToOne(() => Group, (group) => group.matches, {
    nullable: true,
  })
  group: Group;

  @ManyToOne(() => TeamOrmEntity, (team) => team.homeMatches)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: TeamOrmEntity;

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
