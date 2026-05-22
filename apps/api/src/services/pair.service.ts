import type { PrismaClient } from '../generated/prisma';
import type { CreatePairInput } from '@atlas-birdie/validators';

export class PairService {
  constructor(private readonly prisma: PrismaClient) {}

  async findOrCreate(input: CreatePairInput) {
    const existing = await this.prisma.pair.findFirst({
      where: {
        discipline: input.discipline,
        OR: [
          { athleteAId: input.athleteAId, athleteBId: input.athleteBId },
          { athleteAId: input.athleteBId, athleteBId: input.athleteAId },
        ],
        deletedAt: null,
      },
    });

    if (existing) {
      if (!existing.isActive) {
        return this.prisma.pair.update({ where: { id: existing.id }, data: { isActive: true } });
      }
      return existing;
    }

    return this.prisma.pair.create({ data: input });
  }

  async deactivate(id: string) {
    return this.prisma.pair.update({ where: { id }, data: { isActive: false } });
  }

  async listByAthlete(athleteId: string) {
    return this.prisma.pair.findMany({
      where: {
        OR: [{ athleteAId: athleteId }, { athleteBId: athleteId }],
        deletedAt: null,
        isActive: true,
      },
      include: {
        athleteA: { select: { id: true, name: true, slug: true, photoUrl: true } },
        athleteB: { select: { id: true, name: true, slug: true, photoUrl: true } },
      },
    });
  }
}
