import { Standing } from '../../domain/entities/standing.entity';
import { StandingOrmEntity } from './standing.orm-entity';

export class StandingMapper {
  static toDomain(orm: StandingOrmEntity): Standing {
    const standing = new Standing();
    standing.played = orm.played;
    standing.wins = orm.wins;
    standing.draws = orm.draws;
    standing.losses = orm.losses;
    standing.goalsFor = orm.goalsFor;
    standing.goalsAgainst = orm.goalsAgainst;
    standing.points = orm.points;
    standing.tournamentId = orm.tournamentId;
    standing.phaseId = orm.phaseId;
    standing.groupId = orm.groupId;
    standing.teamId = orm.teamId;
    if (orm.team) {
      standing.team = {
        id: orm.team.id,
        name: orm.team.name,
      };
    }

    return standing;
  }

  static toOrm(domain: Standing): StandingOrmEntity {
    const orm = new StandingOrmEntity();
    if (domain.id != null) {
      orm.id = domain.id;
    }
    orm.played = domain.played;
    orm.wins = domain.wins;
    orm.draws = domain.draws;
    orm.losses = domain.losses;
    orm.goalsFor = domain.goalsFor;
    orm.goalsAgainst = domain.goalsAgainst;
    orm.points = domain.points;
    orm.tournamentId = domain.tournamentId;
    orm.phaseId = domain.phaseId;
    if (domain.groupId != null) {
      orm.groupId = domain.groupId;
    }
    orm.teamId = domain.teamId;
    return orm;
  }
}
