export type Discipline = 'MS' | 'WS' | 'MD' | 'WD' | 'XD';

export interface PairDTO {
  id: string;
  discipline: Discipline;
  athleteAId: string;
  athleteBId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
