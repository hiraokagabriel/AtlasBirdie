import type { PrismaClient, Discipline } from '../generated/prisma/index.js';

export interface ListPairsParams {
  tenantId?: string;
  athleteId?: string;
  discipline?: Discipline;
  isActive?: boolean;
  page?: number;
  perPage?: number;
}

export interface CreatePairInput {
  discipline: Discipline;
  athleteAId: string;
  athleteBId: string;
}

export function createPairService(prisma: PrismaClient) {
  return {
    async list(params: ListPairsParams) {
      const { athleteId, discipline, isActive, page = 1, perPage = 20 } = params;

      const where = {
        deletedAt: null,
        ...(discipline && { discipline }),
        ...(isActive !== undefined && { isActive }),
        ...(athleteId && {
          OR: [{ athleteAId: athleteId }, { athleteBId: athleteId }],
        }),
      };

      const [data, total] = await prisma.$transaction([
        prisma.pair.findMany({
          where,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            discipline: true,
            isActive: true,
            createdAt: true,
            athleteA: {
              select: { id: true, name: true, slug: true, photoUrl: true },
            },
            athleteB: {
              select: { id: true, name: true, slug: true, photoUrl: true },
            },
            rankingEntries: {
              take: 1,
              orderBy: { position: 'asc' },
              select: {
                position: true,
                points: true,
                rankingConfig: { select: { season: true } },
              },
            },
          },
        }),
        prisma.pair.count({ where }),
      ]);

      return {
        data,
        meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
      };
    },

    async getById(id: string) {
      return prisma.pair.findFirst({
        where: { id, deletedAt: null },
        include: {
          athleteA: {
            select: {
              id: true,
              name: true,
              slug: true,
              photoUrl: true,
              city: true,
              state: true,
              club: { select: { id: true, name: true, slug: true, acronym: true } },
            },
          },
          athleteB: {
            select: {
              id: true,
              name: true,
              slug: true,
              photoUrl: true,
              city: true,
              state: true,
              club: { select: { id: true, name: true, slug: true, acronym: true } },
            },
          },
          rankingEntries: {
            orderBy: { position: 'asc' },
            include: {
              rankingConfig: { select: { discipline: true, season: true } },
            },
          },
        },
      });
    },

    async create(input: CreatePairInput) {
      // Garante que athleteAId < athleteBId para evitar duplicatas invertidas
      const [a, b] =
        input.athleteAId < input.athleteBId
          ? [input.athleteAId, input.athleteBId]
          : [input.athleteBId, input.athleteAId];

      return prisma.pair.create({
        data: { discipline: input.discipline, athleteAId: a, athleteBId: b },
      });
    },

    async setActive(id: string, isActive: boolean) {
      return prisma.pair.update({
        where: { id },
        data: { isActive },
      });
    },

    async softDelete(id: string) {
      return prisma.pair.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },
  };
}
