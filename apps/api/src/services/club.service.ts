import type { PrismaClient } from '../generated/prisma';
import type { CreateClubInput, UpdateClubInput } from '@atlas-birdie/validators';

export interface ClubListParams {
  tenantId: string;
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
}

export class ClubService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(params: ClubListParams) {
    const { tenantId, page = 1, perPage = 20, search, status } = params;
    const skip = (page - 1) * perPage;

    const where = {
      tenantId,
      deletedAt: null,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(status && { status: status as never }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.club.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { name: 'asc' },
        include: { _count: { select: { athletes: { where: { deletedAt: null } } } } },
      }),
      this.prisma.club.count({ where }),
    ]);

    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findBySlug(slug: string, tenantId: string) {
    return this.prisma.club.findFirst({
      where: { slug, tenantId, deletedAt: null },
      include: {
        athletes: {
          where: { deletedAt: null, status: 'ACTIVE' },
          select: { id: true, name: true, slug: true, photoUrl: true, gender: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async create(tenantId: string, input: CreateClubInput) {
    return this.prisma.club.create({ data: { tenantId, ...input } });
  }

  async update(id: string, tenantId: string, input: UpdateClubInput) {
    return this.prisma.club.update({ where: { id }, data: input });
  }

  async softDelete(id: string, tenantId: string) {
    return this.prisma.club.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
