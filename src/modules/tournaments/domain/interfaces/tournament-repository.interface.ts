import { Tournament } from '../entities/tournament.entity';

export interface ITournamentRepository {
  create(tournament: Tournament): Promise<Tournament>;
  findById(id: number): Promise<Tournament | null>;
  findByName(name: string): Promise<Tournament | null>;
  update(id: number, data: Partial<Tournament>): Promise<Tournament | null>;
  // TODO: Agregar mas metodos
}
