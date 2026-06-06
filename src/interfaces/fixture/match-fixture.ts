export interface MatchFixture {
  homeTeam: number;
  awayTeam: number;
}

export interface Fixture {
  matches: MatchFixture[];
}
