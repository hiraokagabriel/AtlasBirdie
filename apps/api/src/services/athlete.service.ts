import type { PrismaClient, AthleteStatus } from '../generated/prisma/index.js';

export interface ListAthletesParams {
  tenantId?: string;
  clubId?: string;
  status?: AthleteStatus;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface CreateAthleteInput {
  tenantId: string;
  clubId?: string;
  name: string;
  slug: string;
  document?: string;
  photoUrl?: string;
  birthDate?: Date;
  gender?: string;
  handedness?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateAthleteInput {
  clubId?: string | null;
  name?: string;
  document?: string | null;
  photoUrl?: string | null;
  birthDate?: Date | null;
  gender?: string | null;
  handedness?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string;
  status?: AthleteStatus;
}

export function createAthleteService(prisma: PrismaClient) {
  return {
    async list(params: ListAthletesParams) {
      const { tenantId, clubId, status, search, page = 1, perPage = 20 } = params;

      const where = {
        deletedAt: null,
        ...(tenantId && { tenantId }),
        ...(clubId && { clubId }),
        ...(status && { status }),
        ...(search && {
          name: { contains: search, mode: 'insensitive' as const },
        }),
      };

      const [data, total] = await prisma.$transaction([
        prisma.athlete.findMany({
          where,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            photoUrl: true,
            city: true,
            state: true,
            country: true,
            status: true,
            createdAt: true,
            club: {
              select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
            },
          },
        }),
        prisma.athlete.count({ where }),
      ]);

      return {
        data,
        meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
      };
    },

    async getBySlug(slug: string) {
      return prisma.athlete.findFirst({
        where: { slug, deletedAt: null },
        include: {
          club: {
            select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
          },
          rankingEntries: {
            take: 5,
            orderBy: { position: 'asc' },
            include: {
              rankingConfig: {
                select: { discipline: true, season: true },
              },
            },
          },
        },
      });
    },

    async create(input: CreateAthleteInput) {
      return prisma.athlete.create({ data: input });
    },

    async update(id: string, input: UpdateAthleteInput) {
      return prisma.athlete.update({ where: { id }, data: input });
    },

    async softDelete(id: string) {
      return prisma.athlete.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },

    async findByDocument(tenantId: string, document: string) {
      return prisma.athlete.findFirst({
        where: { tenantId, document, deletedAt: null },
        select: { id: true, name: true, slug: true },
      });
    },
  };
}
