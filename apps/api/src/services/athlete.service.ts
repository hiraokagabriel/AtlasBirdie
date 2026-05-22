import type { PrismaClient } from '../generated/prisma';
import type { CreateAthleteInput, UpdateAthleteInput } from '@atlas-birdie/validators';

export interface AthleteListParams {
  tenantId: string;
  page?: number;
  perPage?: number;
  search?: string;
  clubId?: string;
  status?: string;
}

export class AthleteService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(params: AthleteListParams) {
    const { tenantId, page = 1, perPage = 20, search, clubId, status } = params;
    const skip = (page - 1) * perPage;

    const where = {
      tenantId,
      deletedAt: null,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(clubId && { clubId }),
      ...(status && { status: status as never }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.athlete.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { name: 'asc' },
        include: { club: { select: { id: true, name: true, slug: true, logoUrl: true } } },
      }),
      this.prisma.athlete.count({ where }),
    ]);

    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findBySlug(slug: string, tenantId: string) {
    return this.prisma.athlete.findFirst({
      where: { slug, tenantId, deletedAt: null },
      include: {
        club: { select: { id: true, name: true, slug: true, logoUrl: true, acronym: true } },
        pairsAsA: { where: { deletedAt: null, isActive: true }, include: { athleteB: { select: { id: true, name: true, slug: true, photoUrl: true } } } },
        pairsAsB: { where: { deletedAt: null, isActive: true }, include: { athleteA: { select: { id: true, name: true, slug: true, photoUrl: true } } } },
      },
    });
  }

  async create(tenantId: string, input: CreateAthleteInput) {
    return this.prisma.athlete.create({
      data: { tenantId, ...input },
    });
  }

  async update(id: string, tenantId: string, input: UpdateAthleteInput) {
    return this.prisma.athlete.update({
      where: { id },
      data: input,
    });
  }

  async softDelete(id: string, tenantId: string) {
    return this.prisma.athlete.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
