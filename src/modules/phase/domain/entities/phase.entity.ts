export class Phase {
  id?: number;
  name: string;
  status: string;
  order_number?: number;
  tournamentId?: number;
  typeId?: number;

  static create(
    name: string,
    status: string,
    order_number: number,
    tournamentId: number,
    typeId: number,
  ) {
    const phase = new Phase();
    phase.name = name;
    phase.status = status;
    phase.order_number = order_number;
    phase.tournamentId = tournamentId;
    phase.typeId = typeId;
    return phase;
  }
}
