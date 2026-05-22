import type { PrismaClient } from '../generated/prisma'
import type { CreateAthleteInput, UpdateAthleteInput, ListAthletesInput } from '@atlas/validators'

export class AthleteService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(tenantId: string, input: ListAthletesInput) {
    const { page, perPage, search, clubId, status } = input
    const skip = (page - 1) * perPage

    const where = {
      tenantId,
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(clubId ? { clubId } : {}),
      ...(search
        ? {
            name: { contains: search, mode: 'insensitive' as const },
          }
        : {}),
    }

    const [athletes, total] = await this.prisma.$transaction([
      this.prisma.athlete.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { name: 'asc' },
        include: {
          club: {
            select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
          },
        },
      }),
      this.prisma.athlete.count({ where }),
    ])

    return {
      data: athletes,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async findBySlug(tenantId: string, slug: string) {
    const athlete = await this.prisma.athlete.findFirst({
      where: { tenantId, slug, deletedAt: null },
      include: {
        club: {
          select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
        },
      },
    })

    return athlete
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.athlete.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        club: {
          select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
        },
      },
    })
  }

  async create(tenantId: string, input: CreateAthleteInput) {
    const existing = await this.prisma.athlete.findFirst({
      where: { tenantId, slug: input.slug, deletedAt: null },
    })

    if (existing) {
      throw Object.assign(new Error('Slug already taken'), { code: 'SLUG_CONFLICT', status: 409 })
    }

    return this.prisma.athlete.create({
      data: {
        ...input,
        tenantId,
        birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      },
      include: {
        club: {
          select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
        },
      },
    })
  }

  async update(tenantId: string, id: string, input: UpdateAthleteInput) {
    const athlete = await this.findById(tenantId, id)
    if (!athlete) {
      throw Object.assign(new Error('Athlete not found'), { code: 'NOT_FOUND', status: 404 })
    }

    if (input.slug && input.slug !== athlete.slug) {
      const conflict = await this.prisma.athlete.findFirst({
        where: { tenantId, slug: input.slug, deletedAt: null, NOT: { id } },
      })
      if (conflict) {
        throw Object.assign(new Error('Slug already taken'), { code: 'SLUG_CONFLICT', status: 409 })
      }
    }

    return this.prisma.athlete.update({
      where: { id },
      data: {
        ...input,
        birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      },
      include: {
        club: {
          select: { id: true, name: true, slug: true, acronym: true, logoUrl: true },
        },
      },
    })
  }

  async softDelete(tenantId: string, id: string) {
    const athlete = await this.findById(tenantId, id)
    if (!athlete) {
      throw Object.assign(new Error('Athlete not found'), { code: 'NOT_FOUND', status: 404 })
    }

    return this.prisma.athlete.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
