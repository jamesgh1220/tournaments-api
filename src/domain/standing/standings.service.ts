import { Match } from 'src/modules/matches/domain/entities/match.entity';
import { Standing } from 'src/modules/standings/domain/entities/standing.entity';
import { Team } from 'src/modules/teams/domain/entities/teams.entity';

export class StandingService {
  phaseInitial(
    tournamentId: number,
    phaseId: number,
    teams: Team[],
    groupId?: number,
  ): Standing[] {
    const standings: Standing[] = [];

    for (const team of teams) {
      const standing = Standing.create(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        tournamentId,
        phaseId,
        team.id ?? 0,
        groupId,
      );

      standings.push(standing);
    }

    return standings;
  }

  update(standing: Standing) {
    
  }
}