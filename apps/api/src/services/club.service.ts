import type { PrismaClient } from '../generated/prisma'
import type { CreateClubInput, UpdateClubInput, ListClubsInput } from '@atlas/validators'

export class ClubService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(tenantId: string, input: ListClubsInput) {
    const { page, perPage, search, status } = input
    const skip = (page - 1) * perPage

    const where = {
      tenantId,
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    }

    const [clubs, total] = await this.prisma.$transaction([
      this.prisma.club.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { name: 'asc' },
        include: { _count: { select: { athletes: true } } },
      }),
      this.prisma.club.count({ where }),
    ])

    return {
      data: clubs,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async findBySlug(tenantId: string, slug: string) {
    return this.prisma.club.findFirst({
      where: { tenantId, slug, deletedAt: null },
      include: { _count: { select: { athletes: true } } },
    })
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.club.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { _count: { select: { athletes: true } } },
    })
  }

  async create(tenantId: string, input: CreateClubInput) {
    const existing = await this.prisma.club.findFirst({
      where: { tenantId, slug: input.slug, deletedAt: null },
    })

    if (existing) {
      throw Object.assign(new Error('Slug already taken'), { code: 'SLUG_CONFLICT', status: 409 })
    }

    return this.prisma.club.create({
      data: { ...input, tenantId },
      include: { _count: { select: { athletes: true } } },
    })
  }

  async update(tenantId: string, id: string, input: UpdateClubInput) {
    const club = await this.findById(tenantId, id)
    if (!club) {
      throw Object.assign(new Error('Club not found'), { code: 'NOT_FOUND', status: 404 })
    }

    if (input.slug && input.slug !== club.slug) {
      const conflict = await this.prisma.club.findFirst({
        where: { tenantId, slug: input.slug, deletedAt: null, NOT: { id } },
      })
      if (conflict) {
        throw Object.assign(new Error('Slug already taken'), { code: 'SLUG_CONFLICT', status: 409 })
      }
    }

    return this.prisma.club.update({
      where: { id },
      data: input,
      include: { _count: { select: { athletes: true } } },
    })
  }

  async softDelete(tenantId: string, id: string) {
    const club = await this.findById(tenantId, id)
    if (!club) {
      throw Object.assign(new Error('Club not found'), { code: 'NOT_FOUND', status: 404 })
    }

    return this.prisma.club.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
