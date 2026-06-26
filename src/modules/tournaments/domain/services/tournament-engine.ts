import { Team } from 'src/modules/teams/domain/entities/teams.entity';
import { Fixture } from 'src/interfaces/fixture/match-fixture';

export class TournamentEngine {
  generateFixture(phaseId: number, configType: string, teams: Team[]) {
    switch (configType) {
      case 'LEAGUE':
        return this.engineLeague(teams, phaseId);

      default:
        throw new Error(`Tournament type ${configType} not supported`);
    }
  }

  engineLeague(teams: Team[], phaseId: number): Fixture {
    const fixture: Fixture = {
      matches: [],
    };
    let allTeams = [...teams];
    for (let i = 0; i < teams.length; i++) {
      const singleTeam = teams[i];
      for (let j = 1; j < allTeams.length; j++) {
        fixture.matches.push({
          homeScore: 0,
          awayScore: 0,
          status: 'TO_COME',
          // scheduledAt: new Date(),
          homeTeamId: singleTeam.id!,
          awayTeamId: allTeams[j].id!,
          phaseId,
        });
        fixture.matches.push({
          homeScore: 0,
          awayScore: 0,
          status: 'TO_COME',
          homeTeamId: allTeams[j].id!,
          awayTeamId: singleTeam.id!,
          phaseId,
        });
      }
      allTeams = allTeams.filter((team) => team.id !== singleTeam.id!);
    }

    return fixture;
  }
}
