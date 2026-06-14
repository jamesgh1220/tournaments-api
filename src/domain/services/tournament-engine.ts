import { Team } from 'src/modules/teams/domain/entities/teams.entity';
import { Fixture } from '../../interfaces/fixture/match-fixture';

export class TournamentEngine {
  generateFixture(config: any, teams: any) {
    switch (config.type) {
      case 'LEAGUE':
        return this.engineLeague(teams);

      default:
        throw new Error(`Tournament type ${config.type} not supported`);
    }
  }

  engineLeague(teams: Team[]): Fixture {
    const fixture: Fixture = {
      matches: [],
    };
    let allTeams = [...teams];
    for (let i = 0; i < teams.length; i++) {
      const singleTeam = teams[i];
      for (let j = 1; j < allTeams.length; j++) {
        fixture.matches.push({
          homeTeam: singleTeam.id,
          awayTeam: allTeams[j].id,
        });
        fixture.matches.push({
          homeTeam: allTeams[j].id,
          awayTeam: singleTeam.id,
        });
      }
      allTeams = allTeams.filter((team) => team.id !== singleTeam.id);
    }

    return fixture;
  }
}
