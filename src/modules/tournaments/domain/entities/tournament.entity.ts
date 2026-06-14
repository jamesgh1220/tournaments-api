import { Team } from 'src/modules/teams/domain/entities/teams.entity';

export class Tournament {
  id?: number;
  name: string;
  state: string;
  configuration: Record<string, any>;
  startDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  teams: Team[];

  static create(
    name: string,
    state: string,
    configuration: object,
    startDate: Date,
  ): Tournament {
    const tournament = new Tournament();
    tournament.name = name;
    tournament.state = state || 'TO_COME';
    tournament.configuration = configuration;
    tournament.startDate = startDate;
    tournament.teams = [];
    return tournament;
  }
}
