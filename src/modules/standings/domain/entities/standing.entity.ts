import { Team } from "src/modules/teams/domain/entities/teams.entity";

export class Standing {
  id?: number;

  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  tournamentId: number;
  phaseId: number;
  teamId: number;
  team: Team;
  groupId?: number;

  static create(
    played: number,
    wins: number,
    draws: number,
    losses: number,
    goalsFor: number,
    goalsAgainst: number,
    points: number,
    tournamentId: number,
    phaseId: number,
    teamId: number,
    groupId?: number,
  ) {
    const standing = new Standing();
    standing.played = played;
    standing.wins = wins;
    standing.draws = draws;
    standing.losses = losses;
    standing.goalsFor = goalsFor;
    standing.goalsAgainst = goalsAgainst;
    standing.points = points;
    standing.tournamentId = tournamentId;
    standing.phaseId = phaseId;
    standing.teamId = teamId;
    standing.groupId = groupId;

    return standing;
  }
}
