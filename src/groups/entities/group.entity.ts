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
import { PhaseOrmEntity } from 'src/modules/phase/infrastructure/persistence/phase.orm-entity';
import { MatchOrmEntity } from 'src/modules/matches/infrastructure/persistence/match.orm-entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => PhaseOrmEntity, (phase) => phase.groups)
  phase: PhaseOrmEntity;

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

  @OneToMany(() => MatchOrmEntity, (match) => match.group)
  matches: MatchOrmEntity[];

  @OneToMany(() => Standing, (standing) => standing.group)
  standings: Standing[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
