import { Group } from 'src/groups/entities/group.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { Team } from 'src/modules/teams/domain/entities/teams.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

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

  @ManyToOne(() => Team, (team) => team.homeMatches)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: Team;

  @Column()
  homeScore: number;

  @Column()
  awayScore: number;

  @Column({ default: 'TO_COME' })
  status: string;

  @Column({
    type: 'date',
  })
  scheduledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
