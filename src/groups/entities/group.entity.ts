import { Match } from 'src/matches/entities/match.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { Standing } from 'src/standings/entities/standing.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Phase, (phase) => phase.groups)
  phase: Phase;

  @ManyToMany(() => TeamOrmEntity, team => team.groups)
  @JoinTable({
    name: 'group_teams',
    joinColumn: {
      name: 'groupId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'teamId',
      referencedColumnName: 'id',
    },
  })
  teams: TeamOrmEntity[];

  @OneToMany(() => Match, (match) => match.group)
  matches: Match[];

  @OneToMany(() => Standing, (standing) => standing.group)
  standings: Standing[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
