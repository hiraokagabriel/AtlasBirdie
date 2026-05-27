import {
  PrismaClient,
  AthleteStatus,
  ClubStatus,
  TournamentStatus,
  BracketFormat,
  InscriptionStatus,
  UserRole,
  Discipline,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Atlas Birdie database...')

  // ─── TENANT ──────────────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'federacao-badminton-sp' },
    update: {},
    create: {
      name: 'Federação Badminton São Paulo',
      slug: 'federacao-badminton-sp',
      primaryColor: '#01696f',
      description: 'Federação oficial de badminton do estado de São Paulo.',
      website: 'https://badmintonsp.com.br',
      instagram: '@badmintonsp',
      email: 'contato@badmintonsp.com.br',
    },
  })
  console.log(`✅ Tenant: ${tenant.name}`)

  // ─── CLUBS ───────────────────────────────────────────────────────────────────
  const clubs = await Promise.all([
    prisma.club.upsert({
      where: { slug: 'shuttle-sp' },
      update: {},
      create: {
        tenantId: tenant.id,
        name: 'Shuttle São Paulo',
        slug: 'shuttle-sp',
        acronym: 'SSP',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
        status: ClubStatus.ACTIVE,
      },
    }),
    prisma.club.upsert({
      where: { slug: 'birdie-campinas' },
      update: {},
      create: {
        tenantId: tenant.id,
        name: 'Birdie Campinas',
        slug: 'birdie-campinas',
        acronym: 'BCP',
        city: 'Campinas',
        state: 'SP',
        country: 'BR',
        status: ClubStatus.ACTIVE,
      },
    }),
    prisma.club.upsert({
      where: { slug: 'smash-santos' },
      update: {},
      create: {
        tenantId: tenant.id,
        name: 'Smash Santos',
        slug: 'smash-santos',
        acronym: 'SMS',
        city: 'Santos',
        state: 'SP',
        country: 'BR',
        status: ClubStatus.ACTIVE,
      },
    }),
  ])
  console.log(`✅ Clubs: ${clubs.map((c) => c.name).join(', ')}`)

  // ─── ATHLETES ────────────────────────────────────────────────────────────────
  const athletesData = [
    { name: 'Lucas Oliveira',     slug: 'lucas-oliveira',     gender: 'M', birthDate: '1998-03-12', clubIdx: 0, handedness: 'RIGHT' },
    { name: 'Pedro Almeida',      slug: 'pedro-almeida',      gender: 'M', birthDate: '2000-07-22', clubIdx: 0, handedness: 'RIGHT' },
    { name: 'Rafael Costa',       slug: 'rafael-costa',       gender: 'M', birthDate: '1997-11-05', clubIdx: 1, handedness: 'LEFT'  },
    { name: 'Mateus Ferreira',    slug: 'mateus-ferreira',    gender: 'M', birthDate: '2001-01-30', clubIdx: 1, handedness: 'RIGHT' },
    { name: 'Bruno Souza',        slug: 'bruno-souza',        gender: 'M', birthDate: '1999-09-18', clubIdx: 2, handedness: 'RIGHT' },
    { name: 'Thiago Lima',        slug: 'thiago-lima',        gender: 'M', birthDate: '2002-04-25', clubIdx: 2, handedness: 'RIGHT' },
    { name: 'Ana Paula Silva',    slug: 'ana-paula-silva',    gender: 'F', birthDate: '1999-06-14', clubIdx: 0, handedness: 'RIGHT' },
    { name: 'Beatriz Rocha',      slug: 'beatriz-rocha',      gender: 'F', birthDate: '2001-02-08', clubIdx: 0, handedness: 'RIGHT' },
    { name: 'Camila Martins',     slug: 'camila-martins',     gender: 'F', birthDate: '1998-08-20', clubIdx: 1, handedness: 'LEFT'  },
    { name: 'Daniela Nascimento', slug: 'daniela-nascimento', gender: 'F', birthDate: '2000-12-03', clubIdx: 1, handedness: 'RIGHT' },
    { name: 'Fernanda Torres',    slug: 'fernanda-torres',    gender: 'F', birthDate: '1997-05-17', clubIdx: 2, handedness: 'RIGHT' },
    { name: 'Gabriela Ramos',     slug: 'gabriela-ramos',     gender: 'F', birthDate: '2002-10-29', clubIdx: 2, handedness: 'RIGHT' },
  ]

  const athletes = await Promise.all(
    athletesData.map((a) =>
      prisma.athlete.upsert({
        where: { slug: a.slug },
        update: {},
        create: {
          tenantId: tenant.id,
          clubId: clubs[a.clubIdx].id,
          name: a.name,
          slug: a.slug,
          gender: a.gender,
          birthDate: new Date(a.birthDate),
          handedness: a.handedness,
          city: clubs[a.clubIdx].city,
          state: 'SP',
          country: 'BR',
          status: AthleteStatus.ACTIVE,
        },
      }),
    ),
  )
  console.log(`✅ Athletes: ${athletes.length} criados`)

  // ─── PAIRS (MD, WD, XD) ──────────────────────────────────────────────────────
  const pairs = await Promise.all([
    // MD
    prisma.pair.upsert({
      where: { discipline_athleteAId_athleteBId: { discipline: Discipline.MD, athleteAId: athletes[0].id, athleteBId: athletes[1].id } },
      update: {},
      create: { discipline: Discipline.MD, athleteAId: athletes[0].id, athleteBId: athletes[1].id },
    }),
    prisma.pair.upsert({
      where: { discipline_athleteAId_athleteBId: { discipline: Discipline.MD, athleteAId: athletes[2].id, athleteBId: athletes[3].id } },
      update: {},
      create: { discipline: Discipline.MD, athleteAId: athletes[2].id, athleteBId: athletes[3].id },
    }),
    // WD
    prisma.pair.upsert({
      where: { discipline_athleteAId_athleteBId: { discipline: Discipline.WD, athleteAId: athletes[6].id, athleteBId: athletes[7].id } },
      update: {},
      create: { discipline: Discipline.WD, athleteAId: athletes[6].id, athleteBId: athletes[7].id },
    }),
    prisma.pair.upsert({
      where: { discipline_athleteAId_athleteBId: { discipline: Discipline.WD, athleteAId: athletes[8].id, athleteBId: athletes[9].id } },
      update: {},
      create: { discipline: Discipline.WD, athleteAId: athletes[8].id, athleteBId: athletes[9].id },
    }),
    // XD
    prisma.pair.upsert({
      where: { discipline_athleteAId_athleteBId: { discipline: Discipline.XD, athleteAId: athletes[0].id, athleteBId: athletes[6].id } },
      update: {},
      create: { discipline: Discipline.XD, athleteAId: athletes[0].id, athleteBId: athletes[6].id },
    }),
    prisma.pair.upsert({
      where: { discipline_athleteAId_athleteBId: { discipline: Discipline.XD, athleteAId: athletes[2].id, athleteBId: athletes[8].id } },
      update: {},
      create: { discipline: Discipline.XD, athleteAId: athletes[2].id, athleteBId: athletes[8].id },
    }),
  ])
  console.log(`✅ Pairs: ${pairs.length} criadas`)

  // ─── TOURNAMENTS ─────────────────────────────────────────────────────────────
  const tournamentsData = [
    {
      name: 'Open SP de Badminton 2026',
      slug: 'open-sp-badminton-2026',
      location: 'Ginásio do Ibirapuera',
      city: 'São Paulo',
      state: 'SP',
      startDate: new Date('2026-06-14'),
      endDate: new Date('2026-06-15'),
      status: TournamentStatus.REGISTRATIONS_OPEN,
      description: 'Maior torneio aberto do estado de São Paulo.',
    },
    {
      name: 'Campeonato Estadual SP 2026',
      slug: 'estadual-sp-2026',
      location: 'Centro Esportivo Tietê',
      city: 'São Paulo',
      state: 'SP',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-03'),
      status: TournamentStatus.DRAFT,
      description: 'Campeonato oficial da federação estadual.',
    },
    {
      name: 'Copa Interior SP 2026',
      slug: 'copa-interior-sp-2026',
      location: 'Arena Multiuso Campinas',
      city: 'Campinas',
      state: 'SP',
      startDate: new Date('2026-04-05'),
      endDate: new Date('2026-04-06'),
      status: TournamentStatus.FINISHED,
      description: 'Competição regional do interior paulista.',
    },
  ]

  const tournaments = await Promise.all(
    tournamentsData.map((t) =>
      prisma.tournament.upsert({
        where: { slug: t.slug },
        update: {},
        create: { tenantId: tenant.id, ...t },
      }),
    ),
  )
  console.log(`✅ Tournaments: ${tournaments.map((t) => t.name).join(', ')}`)

  // ─── TOURNAMENT EVENTS ───────────────────────────────────────────────────────
  const openTournament = tournaments[0]
  const events = await Promise.all([
    prisma.tournamentEvent.upsert({
      where: { tournamentId_discipline_category: { tournamentId: openTournament.id, discipline: Discipline.MS, category: 'OPEN' } },
      update: {},
      create: {
        tournamentId: openTournament.id,
        discipline: Discipline.MS,
        category: 'OPEN',
        bracketFormat: BracketFormat.SINGLE_ELIMINATION,
        maxInscriptions: 32,
        status: TournamentStatus.REGISTRATIONS_OPEN,
      },
    }),
    prisma.tournamentEvent.upsert({
      where: { tournamentId_discipline_category: { tournamentId: openTournament.id, discipline: Discipline.WS, category: 'OPEN' } },
      update: {},
      create: {
        tournamentId: openTournament.id,
        discipline: Discipline.WS,
        category: 'OPEN',
        bracketFormat: BracketFormat.SINGLE_ELIMINATION,
        maxInscriptions: 16,
        status: TournamentStatus.REGISTRATIONS_OPEN,
      },
    }),
    prisma.tournamentEvent.upsert({
      where: { tournamentId_discipline_category: { tournamentId: openTournament.id, discipline: Discipline.MD, category: 'OPEN' } },
      update: {},
      create: {
        tournamentId: openTournament.id,
        discipline: Discipline.MD,
        category: 'OPEN',
        bracketFormat: BracketFormat.SINGLE_ELIMINATION,
        maxInscriptions: 16,
        status: TournamentStatus.REGISTRATIONS_OPEN,
      },
    }),
    prisma.tournamentEvent.upsert({
      where: { tournamentId_discipline_category: { tournamentId: openTournament.id, discipline: Discipline.WD, category: 'OPEN' } },
      update: {},
      create: {
        tournamentId: openTournament.id,
        discipline: Discipline.WD,
        category: 'OPEN',
        bracketFormat: BracketFormat.SINGLE_ELIMINATION,
        maxInscriptions: 16,
        status: TournamentStatus.REGISTRATIONS_OPEN,
      },
    }),
    prisma.tournamentEvent.upsert({
      where: { tournamentId_discipline_category: { tournamentId: openTournament.id, discipline: Discipline.XD, category: 'OPEN' } },
      update: {},
      create: {
        tournamentId: openTournament.id,
        discipline: Discipline.XD,
        category: 'OPEN',
        bracketFormat: BracketFormat.SINGLE_ELIMINATION,
        maxInscriptions: 16,
        status: TournamentStatus.REGISTRATIONS_OPEN,
      },
    }),
  ])
  console.log(`✅ TournamentEvents: ${events.length} criados no Open SP`)

  // ─── INSCRIPTIONS ────────────────────────────────────────────────────────────
  const [msEvent, wsEvent, mdEvent, wdEvent, xdEvent] = events

  await Promise.all(
    athletes
      .filter((a) => a.gender === 'M')
      .map((athlete, i) =>
        prisma.inscription.upsert({
          where: { id: `ins-ms-${athlete.slug}` },
          update: {},
          create: {
            id: `ins-ms-${athlete.slug}`,
            eventId: msEvent.id,
            athleteId: athlete.id,
            status: InscriptionStatus.CONFIRMED,
            seed: i < 4 ? i + 1 : null,
            checkedIn: false,
          },
        }),
      ),
  )

  await Promise.all(
    athletes
      .filter((a) => a.gender === 'F')
      .map((athlete, i) =>
        prisma.inscription.upsert({
          where: { id: `ins-ws-${athlete.slug}` },
          update: {},
          create: {
            id: `ins-ws-${athlete.slug}`,
            eventId: wsEvent.id,
            athleteId: athlete.id,
            status: InscriptionStatus.CONFIRMED,
            seed: i < 2 ? i + 1 : null,
            checkedIn: false,
          },
        }),
      ),
  )

  await Promise.all(
    [pairs[0], pairs[1]].map((pair, i) =>
      prisma.inscription.upsert({
        where: { id: `ins-md-${pair.id}` },
        update: {},
        create: {
          id: `ins-md-${pair.id}`,
          eventId: mdEvent.id,
          pairId: pair.id,
          status: InscriptionStatus.CONFIRMED,
          seed: i + 1,
          checkedIn: false,
        },
      }),
    ),
  )

  await Promise.all(
    [pairs[2], pairs[3]].map((pair, i) =>
      prisma.inscription.upsert({
        where: { id: `ins-wd-${pair.id}` },
        update: {},
        create: {
          id: `ins-wd-${pair.id}`,
          eventId: wdEvent.id,
          pairId: pair.id,
          status: InscriptionStatus.CONFIRMED,
          seed: i + 1,
          checkedIn: false,
        },
      }),
    ),
  )

  await Promise.all(
    [pairs[4], pairs[5]].map((pair, i) =>
      prisma.inscription.upsert({
        where: { id: `ins-xd-${pair.id}` },
        update: {},
        create: {
          id: `ins-xd-${pair.id}`,
          eventId: xdEvent.id,
          pairId: pair.id,
          status: InscriptionStatus.CONFIRMED,
          seed: i + 1,
          checkedIn: false,
        },
      }),
    ),
  )
  console.log('✅ Inscriptions: criadas para todos os eventos')

  // ─── RANKING CONFIG ───────────────────────────────────────────────────────────
  const disciplines: Discipline[] = [Discipline.MS, Discipline.WS, Discipline.MD, Discipline.WD, Discipline.XD]
  const rankingConfigs = await Promise.all(
    disciplines.map((discipline) =>
      prisma.rankingConfig.upsert({
        where: { tenantId_discipline_season: { tenantId: tenant.id, discipline, season: 2026 } },
        update: {},
        create: {
          tenantId: tenant.id,
          discipline,
          season: 2026,
          windowWeeks: 52,
          maxTournamentsCount: 10,
          isActive: true,
          validFrom: new Date('2026-01-01'),
        },
      }),
    ),
  )
  console.log(`✅ RankingConfigs: ${rankingConfigs.length} criadas (season 2026)`)

  // ─── POINT RULES ─────────────────────────────────────────────────────────────
  const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3']
  const phaseRules = [
    { phase: 'WINNER',          points: [1000, 600, 300] },
    { phase: 'FINALIST',        points: [750,  450, 225] },
    { phase: 'SEMIFINALIST',    points: [500,  300, 150] },
    { phase: 'QUARTERFINALIST', points: [250,  150,  75] },
    { phase: 'R16',             points: [100,   60,  30] },
    { phase: 'R32',             points: [50,    30,  15] },
  ]

  for (const config of rankingConfigs) {
    for (let li = 0; li < levels.length; li++) {
      for (const p of phaseRules) {
        await prisma.pointRule.upsert({
          where: {
            rankingConfigId_tournamentLevel_phase: {
              rankingConfigId: config.id,
              tournamentLevel: levels[li],
              phase: p.phase,
            },
          },
          update: {},
          create: {
            rankingConfigId: config.id,
            tournamentLevel: levels[li],
            phase: p.phase,
            points: p.points[li],
          },
        })
      }
    }
  }
  console.log('✅ PointRules: criadas para todos os ranking configs')

  // ─── RANKING ENTRIES (MS simulado) ───────────────────────────────────────────
  const msConfig = rankingConfigs[0]
  const msAthletes = athletes.filter((a) => a.gender === 'M')
  const rankingPoints = [1200, 950, 720, 500, 350, 200]

  await Promise.all(
    msAthletes.map((athlete, i) =>
      prisma.rankingEntry.upsert({
        where: { id: `re-ms-2026-${athlete.slug}` },
        update: {},
        create: {
          id: `re-ms-2026-${athlete.slug}`,
          rankingConfigId: msConfig.id,
          athleteId: athlete.id,
          position: i + 1,
          previousPosition: i + 2 <= msAthletes.length ? i + 2 : null,
          points: rankingPoints[i] ?? 100,
          tournamentsCount: Math.max(1, 4 - i),
        },
      }),
    ),
  )
  console.log('✅ RankingEntries: MS 2026 populado')

  // ─── USERS (admin dev) ────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { clerkId: 'dev-super-admin' },
    update: {},
    create: {
      clerkId: 'dev-super-admin',
      email: 'admin@badmintonsp.com.br',
      name: 'Admin SP',
      role: UserRole.SUPER_ADMIN,
      tenantId: tenant.id,
      isActive: true,
    },
  })

  await prisma.user.upsert({
    where: { clerkId: 'dev-federation-admin' },
    update: {},
    create: {
      clerkId: 'dev-federation-admin',
      email: 'federacao@badmintonsp.com.br',
      name: 'Coordenador Federação SP',
      role: UserRole.FEDERATION_ADMIN,
      tenantId: tenant.id,
      isActive: true,
    },
  })
  console.log('✅ Users: SUPER_ADMIN e FEDERATION_ADMIN criados')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log(`   Tenant:      ${tenant.name}`)
  console.log(`   Clubs:       ${clubs.length}`)
  console.log(`   Athletes:    ${athletes.length} (6M + 6F)`)
  console.log(`   Pairs:       ${pairs.length} (2MD + 2WD + 2XD)`)
  console.log(`   Tournaments: ${tournaments.length} (1 open, 1 draft, 1 finished)`)
  console.log(`   Events:      ${events.length} (MS/WS/MD/WD/XD no Open SP)`)
  console.log(`   RankingConf: ${rankingConfigs.length} disciplines × season 2026`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
