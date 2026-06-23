export class Match {
  id?: number;

  homeScore: number;
  awayScore: number;
  status: string;

  phaseId: number;
  groupId?: number;

  homeTeamId: number;
  awayTeamId: number;

  static create(
    homeScore: number,
    awayScore: number,
    status: string,
    phaseId: number,
    groupId: number,
    homeTeamId: number,
    awayTeamId: number,
  ) {
    const match = new Match();
    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.status = status;
    match.phaseId = phaseId;
    match.groupId = groupId;
    match.homeTeamId = homeTeamId;
    match.awayTeamId = awayTeamId;

    return match;
  }
}
