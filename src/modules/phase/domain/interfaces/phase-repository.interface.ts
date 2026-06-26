import { Phase } from '../entities/phase.entity';

export interface IPhaseRepository {
  find(): Promise<Phase[]>;
  create(phase: Phase): Promise<Phase>;
  findById(id: number): Promise<Phase | null>;
  findByTournamentId(tournamentId: number): Promise<Phase[]>;
  findActiveByTournamentId(tournamentId: number): Promise<Phase | null>;
  update(id: number, data: Partial<Phase>): Promise<Phase | null>;
  delete(id: number): Promise<void>;
}
