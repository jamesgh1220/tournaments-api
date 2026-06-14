import { Tournament } from '../entities/tournament.entity';

export interface ITournamentRepository {
  find(): Promise<Tournament[]>;
  create(tournament: Tournament): Promise<Tournament>;
  findById(id: number): Promise<Tournament | null>;
  findByName(name: string): Promise<Tournament | null>;
  update(id: number, data: Partial<Tournament>): Promise<Tournament | null>;
  delete(id: number): Promise<void>;
  addTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null>;
  removeTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null>;
  // TODO: Agregar mas metodos
}
