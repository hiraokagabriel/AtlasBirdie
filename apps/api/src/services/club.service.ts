import type { PrismaClient, ClubStatus } from '../generated/prisma/index.js';

export interface ListClubsParams {
  tenantId?: string;
  status?: ClubStatus;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface CreateClubInput {
  tenantId: string;
  name: string;
  slug: string;
  acronym: string;
  logoUrl?: string;
  primaryColor?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateClubInput {
  name?: string;
  acronym?: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string;
  status?: ClubStatus;
}

export function createClubService(prisma: PrismaClient) {
  return {
    async list(params: ListClubsParams) {
      const { tenantId, status, search, page = 1, perPage = 20 } = params;

      const where = {
        deletedAt: null,
        ...(tenantId && { tenantId }),
        ...(status && { status }),
        ...(search && {
          name: { contains: search, mode: 'insensitive' as const },
        }),
      };

      const [data, total] = await prisma.$transaction([
        prisma.club.findMany({
          where,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            acronym: true,
            logoUrl: true,
            primaryColor: true,
            city: true,
            state: true,
            country: true,
            status: true,
            createdAt: true,
            _count: { select: { athletes: true } },
          },
        }),
        prisma.club.count({ where }),
      ]);

      return {
        data,
        meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
      };
    },

    async getBySlug(slug: string) {
      const club = await prisma.club.findFirst({
        where: { slug, deletedAt: null },
        include: {
          athletes: {
            where: { deletedAt: null, status: 'ACTIVE' },
            orderBy: { name: 'asc' },
            select: {
              id: true,
              name: true,
              slug: true,
              photoUrl: true,
              city: true,
              state: true,
              status: true,
            },
          },
        },
      });

      return club;
    },

    async create(input: CreateClubInput) {
      return prisma.club.create({
        data: input,
      });
    },

    async update(id: string, input: UpdateClubInput) {
      return prisma.club.update({
        where: { id },
        data: input,
      });
    },

    async softDelete(id: string) {
      return prisma.club.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },
  };
}
