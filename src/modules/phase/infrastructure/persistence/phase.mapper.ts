import { Phase } from '../../domain/entities/phase.entity';
import { PhaseOrmEntity } from './phase.orm-entity';

export class PhaseMapper {
  static toDomain(orm: PhaseOrmEntity): Phase {
    const phase = new Phase();
    phase.id = orm.id;
    phase.name = orm.name;
    phase.status = orm.status;
    phase.order_number = orm.order_number;
    phase.tournamentId = orm.tournamentId;
    phase.typeId = orm.typeId;
    return phase;
  }

  static toOrm(domain: Phase): PhaseOrmEntity {
    const orm = new PhaseOrmEntity();
    if (domain.id != null) {
      orm.id = domain.id;
    }
    orm.name = domain.name;
    orm.status = domain.status;
    if (domain.order_number != null) {
      orm.order_number = domain.order_number;
    }
    if (domain.tournamentId != null) {
      orm.tournamentId = domain.tournamentId;
    }
    if (domain.typeId != null) {
      orm.typeId = domain.typeId;
    }
    return orm;
  }
}
