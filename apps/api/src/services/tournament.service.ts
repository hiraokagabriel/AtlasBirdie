import type { PrismaClient } from '../generated/prisma'
import slugify from 'slugify'
import type {
  CreateTournamentInput,
  UpdateTournamentInput,
  CreateEventInput,
  UpdateEventInput,
  CreateCourtInput,
  UpdateCourtInput,
  ListTournamentsInput,
} from '@atlas/validators'

type TournamentWithEventCount = {
  id: string
  slug: string
  name: string
  city: string | null
  state: string | null
  startDate: Date
  endDate: Date
  status: string
  logoUrl: string | null
  _count: { events: number }
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  REGISTRATIONS_OPEN: 'Inscrições Abertas',
  REGISTRATIONS_CLOSED: 'Inscrições Encerradas',
  IN_PROGRESS: 'Em Andamento',
  FINISHED: 'Encerrado',
  ARCHIVED: 'Arquivado',
}

export class TournamentService {
  constructor(private readonly prisma: PrismaClient) {}

  // -------------------------------------------------------------------------
  // Tournament CRUD
  // -------------------------------------------------------------------------

  async list(tenantId: string, input: ListTournamentsInput) {
    const { page, perPage, search, status } = input
    const skip = (page - 1) * perPage

    const where = {
      tenantId,
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { city: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [total, tournaments] = await this.prisma.$transaction([
      this.prisma.tournament.count({ where }),
      this.prisma.tournament.findMany({
        where,
        orderBy: { startDate: 'desc' },
        skip,
        take: perPage,
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          startDate: true,
          endDate: true,
          status: true,
          logoUrl: true,
          _count: { select: { events: true } },
        },
      }),
    ])

    const data = (tournaments as TournamentWithEventCount[]).map((t) => ({
      ...t,
      statusLabel: STATUS_LABELS[t.status] ?? t.status,
      eventsCount: t._count.events,
      periodLabel: this.formatPeriod(t.startDate, t.endDate),
    }))

    return {
      data,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    }
  }

  async findBySlug(tenantId: string, slug: string) {
    return this.prisma.tournament.findFirst({
      where: { tenantId, slug, deletedAt: null },
      include: {
        events: {
          where: { deletedAt: null },
          orderBy: [{ discipline: 'asc' }, { category: 'asc' }],
        },
      },
    })
  }

  async create(tenantId: string, input: CreateTournamentInput) {
    const slug = await this.ensureUniqueSlug(input.slug)

    return this.prisma.tournament.create({
      data: {
        tenantId,
        name: input.name,
        slug,
        logoUrl: input.logoUrl,
        location: input.location,
        city: input.city,
        state: input.state,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        regulationUrl: input.regulationUrl,
        description: input.description,
        status: 'DRAFT',
      },
    })
  }

  async update(tenantId: string, id: string, input: UpdateTournamentInput) {
    await this.assertExists(tenantId, id)

    const data: Record<string, unknown> = { ...input }
    if (input.startDate) data.startDate = new Date(input.startDate)
    if (input.endDate) data.endDate = new Date(input.endDate)
    delete data.slug // slug é imutável após criação

    return this.prisma.tournament.update({ where: { id }, data })
  }

  async softDelete(tenantId: string, id: string) {
    await this.assertExists(tenantId, id)
    return this.prisma.tournament.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  // -------------------------------------------------------------------------
  // Events sub-resource
  // -------------------------------------------------------------------------

  async createEvent(tenantId: string, tournamentId: string, input: CreateEventInput) {
    await this.assertExists(tenantId, tournamentId)
    return this.prisma.tournamentEvent.create({
      data: { tournamentId, ...input },
    })
  }

  async updateEvent(
    tenantId: string,
    tournamentId: string,
    eventId: string,
    input: UpdateEventInput,
  ) {
    await this.assertExists(tenantId, tournamentId)
    await this.assertEventExists(tournamentId, eventId)
    return this.prisma.tournamentEvent.update({ where: { id: eventId }, data: input })
  }

  async deleteEvent(tenantId: string, tournamentId: string, eventId: string) {
    await this.assertExists(tenantId, tournamentId)
    await this.assertEventExists(tournamentId, eventId)
    return this.prisma.tournamentEvent.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    })
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private formatPeriod(start: Date, end: Date): string {
    const fmt = (d: Date) =>
      d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    return start.toISOString().slice(0, 10) === end.toISOString().slice(0, 10)
      ? fmt(start)
      : `${fmt(start)} – ${fmt(end)}`
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    const clean = slugify(base, { lower: true, strict: true })
    const exists = await this.prisma.tournament.findFirst({
      where: { slug: clean, deletedAt: null },
    })
    if (!exists) return clean
    return `${clean}-${Date.now()}`
  }

  private async assertExists(tenantId: string, id: string) {
    const t = await this.prisma.tournament.findFirst({
      where: { id, tenantId, deletedAt: null },
      select: { id: true },
    })
    if (!t) {
      const err = Object.assign(new Error('Tournament not found'), {
        status: 404,
        code: 'NOT_FOUND',
      })
      throw err
    }
  }

  private async assertEventExists(tournamentId: string, eventId: string) {
    const e = await this.prisma.tournamentEvent.findFirst({
      where: { id: eventId, tournamentId, deletedAt: null },
      select: { id: true },
    })
    if (!e) {
      const err = Object.assign(new Error('Event not found'), {
        status: 404,
        code: 'NOT_FOUND',
      })
      throw err
    }
  }
}
