import { Team } from 'src/modules/teams/domain/entities/teams.entity';
import { Tournament } from '../../domain/entities/tournament.entity';
import { TournamentOrmEntity } from './tournament.orm-entity';

export class TournamentMapper {
  static toDomain(orm: TournamentOrmEntity): Tournament {
    const tournament = new Tournament();
    tournament.id = orm.id;
    tournament.name = orm.name;
    tournament.state = orm.state;
    tournament.configuration = orm.configuration;
    tournament.startDate = orm.startDate;
    tournament.createdAt = orm.createdAt;
    tournament.updatedAt = orm.updatedAt;
    tournament.teams =
      orm.teams?.map((t) => {
        const team = new Team();
        team.id = t.id;
        team.name = t.name;
        team.createdAt = t.createdAt;
        team.updatedAt = t.updatedAt;
        return team;
      }) ?? [];
    return tournament;
  }

  static toOrm(domain: Tournament): TournamentOrmEntity {
    const orm = new TournamentOrmEntity();
    if (domain.id != null) {
      orm.id = domain.id;
    }
    orm.name = domain.name;
    orm.state = domain.state;
    orm.configuration = domain.configuration;
    orm.startDate = domain.startDate;
    return orm;
  }
}
