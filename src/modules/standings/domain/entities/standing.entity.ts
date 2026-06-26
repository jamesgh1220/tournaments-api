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
  groupId: number;
  teamId: number;

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
    groupId: number,
    teamId: number,
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
    standing.groupId = groupId;
    standing.teamId = teamId;

    return standing;
  }
}
