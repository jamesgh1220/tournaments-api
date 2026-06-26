import { Group } from '../../domain/entities/group.entity';
import { GroupOrmEntity } from './group.orm-entity';

export class GroupMapper {
  static toDomain(orm: GroupOrmEntity): Group {
    const group = new Group();
    group.id = orm.id;
    group.name = orm.name;
    group.phaseId = orm.phaseId;
    return group;
  }

  static toOrm(domain: Group): GroupOrmEntity {
    const orm = new GroupOrmEntity();
    if (domain.id != null) {
      orm.id = domain.id;
    }
    orm.name = domain.name;
    orm.phaseId = domain.phaseId;

    return orm;
  }
}
