import { Match } from '../../domain/entities/match.entity';
import { MatchOrmEntity } from './match.orm-entity';

export class MatchMapper {
  static toDomain(orm: MatchOrmEntity): Match {
    const match = new Match();
    match.id = orm.id;
    match.homeScore = orm.homeScore;
    match.awayScore = orm.awayScore;
    match.status = orm.status;
    match.phaseId = orm.phaseId;
    match.groupId = orm.groupId;
    match.homeTeamId = orm.homeTeamId;
    match.awayTeamId = orm.awayTeamId;
    return match;
  }

  static toOrm(domain: Match): MatchOrmEntity {
    const orm = new MatchOrmEntity();
    if (domain.id != null) {
      orm.id = domain.id;
    }
    orm.homeScore = domain.homeScore;
    orm.awayScore = domain.awayScore;
    orm.status = domain.status;
    orm.phaseId = domain.phaseId;
    orm.homeTeamId = domain.homeTeamId;
    orm.awayTeamId = domain.awayTeamId;
    if (domain.groupId != null) {
      orm.groupId = domain.groupId;
    }
    return orm;
  }
}
