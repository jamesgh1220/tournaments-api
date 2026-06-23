import { Team } from '../../domain/entities/teams.entity';
import { TeamOrmEntity } from './team.orm-entity';

export class TeamMapper {
  static toDomain(orm: TeamOrmEntity): Team {
    const team = new Team();
    team.id = orm.id;
    team.name = orm.name;
    team.createdAt = orm.createdAt;
    team.updatedAt = orm.updatedAt;
    return team;
  }

  static toOrm(domain: Team): TeamOrmEntity {
    const orm = new TeamOrmEntity();
    if (domain.id != null) {
      orm.id = domain.id;
    }
    orm.name = domain.name;
    return orm;
  }
}
