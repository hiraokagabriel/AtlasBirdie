-- Atlas Birdie — Migration Phase 1
-- create_athletes_and_clubs
-- Cria todas as tabelas do domínio principal

-- Enums
CREATE TYPE "Discipline" AS ENUM ('MS', 'WS', 'MD', 'WD', 'XD');
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'WALKOVER', 'RETIRED', 'ABANDONED', 'NO_MATCH');
CREATE TYPE "InscriptionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLIST');
CREATE TYPE "TournamentStatus" AS ENUM ('DRAFT', 'REGISTRATIONS_OPEN', 'REGISTRATIONS_CLOSED', 'IN_PROGRESS', 'FINISHED', 'ARCHIVED');
CREATE TYPE "BracketFormat" AS ENUM ('SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'GROUPS_WITH_KNOCKOUT', 'SWISS');
CREATE TYPE "AthleteStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');
CREATE TYPE "ClubStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER', 'REFEREE', 'CLUB_MANAGER', 'ATHLETE', 'PUBLIC');

-- Tenants
CREATE TABLE "tenants" (
    "id"           TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "slug"         TEXT NOT NULL,
    "logoUrl"      TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#01696f',
    "description"  TEXT,
    "website"      TEXT,
    "instagram"    TEXT,
    "email"        TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "deletedAt"    TIMESTAMP(3),
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- Clubs
CREATE TABLE "clubs" (
    "id"           TEXT NOT NULL,
    "tenantId"     TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "slug"         TEXT NOT NULL,
    "acronym"      TEXT NOT NULL,
    "logoUrl"      TEXT,
    "primaryColor" TEXT,
    "city"         TEXT,
    "state"        TEXT,
    "country"      TEXT NOT NULL DEFAULT 'BR',
    "status"       "ClubStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "deletedAt"    TIMESTAMP(3),
    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");
CREATE INDEX "clubs_tenantId_idx" ON "clubs"("tenantId");
CREATE INDEX "clubs_status_idx" ON "clubs"("status");

-- Athletes
CREATE TABLE "athletes" (
    "id"         TEXT NOT NULL,
    "tenantId"   TEXT NOT NULL,
    "clubId"     TEXT,
    "name"       TEXT NOT NULL,
    "slug"       TEXT NOT NULL,
    "photoUrl"   TEXT,
    "birthDate"  TIMESTAMP(3),
    "gender"     TEXT,
    "handedness" TEXT,
    "city"       TEXT,
    "state"      TEXT,
    "country"    TEXT NOT NULL DEFAULT 'BR',
    "status"     "AthleteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    "deletedAt"  TIMESTAMP(3),
    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "athletes_slug_key" ON "athletes"("slug");
CREATE INDEX "athletes_tenantId_idx" ON "athletes"("tenantId");
CREATE INDEX "athletes_clubId_idx" ON "athletes"("clubId");
CREATE INDEX "athletes_status_idx" ON "athletes"("status");

-- Users
CREATE TABLE "users" (
    "id"          TEXT NOT NULL,
    "clerkId"     TEXT NOT NULL,
    "email"       TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "role"        "UserRole" NOT NULL DEFAULT 'ATHLETE',
    "tenantId"    TEXT NOT NULL,
    "athleteId"   TEXT,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "deletedAt"   TIMESTAMP(3),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_athleteId_key" ON "users"("athleteId");
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");
CREATE INDEX "users_role_idx" ON "users"("role");

-- Pairs
CREATE TABLE "pairs" (
    "id"         TEXT NOT NULL,
    "discipline" "Discipline" NOT NULL,
    "athleteAId" TEXT NOT NULL,
    "athleteBId" TEXT NOT NULL,
    "isActive"   BOOLEAN NOT NULL DEFAULT true,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    "deletedAt"  TIMESTAMP(3),
    CONSTRAINT "pairs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "pairs_discipline_athleteAId_athleteBId_key" ON "pairs"("discipline", "athleteAId", "athleteBId");
CREATE INDEX "pairs_athleteAId_idx" ON "pairs"("athleteAId");
CREATE INDEX "pairs_athleteBId_idx" ON "pairs"("athleteBId");

-- Tournaments
CREATE TABLE "tournaments" (
    "id"            TEXT NOT NULL,
    "tenantId"      TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "slug"          TEXT NOT NULL,
    "logoUrl"       TEXT,
    "location"      TEXT,
    "city"          TEXT,
    "state"         TEXT,
    "startDate"     TIMESTAMP(3) NOT NULL,
    "endDate"       TIMESTAMP(3) NOT NULL,
    "status"        "TournamentStatus" NOT NULL DEFAULT 'DRAFT',
    "regulationUrl" TEXT,
    "description"   TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "deletedAt"     TIMESTAMP(3),
    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tournaments_slug_key" ON "tournaments"("slug");
CREATE INDEX "tournaments_tenantId_idx" ON "tournaments"("tenantId");
CREATE INDEX "tournaments_status_idx" ON "tournaments"("status");
CREATE INDEX "tournaments_startDate_idx" ON "tournaments"("startDate");

-- TournamentEvents
CREATE TABLE "tournament_events" (
    "id"              TEXT NOT NULL,
    "tournamentId"    TEXT NOT NULL,
    "discipline"      "Discipline" NOT NULL,
    "category"        TEXT NOT NULL,
    "bracketFormat"   "BracketFormat" NOT NULL DEFAULT 'SINGLE_ELIMINATION',
    "maxInscriptions" INTEGER,
    "status"          "TournamentStatus" NOT NULL DEFAULT 'DRAFT',
    "seedingClosedAt" TIMESTAMP(3),
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    "deletedAt"       TIMESTAMP(3),
    CONSTRAINT "tournament_events_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tournament_events_tournamentId_discipline_category_key" ON "tournament_events"("tournamentId", "discipline", "category");
CREATE INDEX "tournament_events_tournamentId_idx" ON "tournament_events"("tournamentId");

-- Inscriptions
CREATE TABLE "inscriptions" (
    "id"          TEXT NOT NULL,
    "eventId"     TEXT NOT NULL,
    "athleteId"   TEXT,
    "pairId"      TEXT,
    "status"      "InscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "seed"        INTEGER,
    "checkedIn"   BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "deletedAt"   TIMESTAMP(3),
    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "inscriptions_eventId_idx" ON "inscriptions"("eventId");
CREATE INDEX "inscriptions_athleteId_idx" ON "inscriptions"("athleteId");
CREATE INDEX "inscriptions_pairId_idx" ON "inscriptions"("pairId");
CREATE INDEX "inscriptions_status_idx" ON "inscriptions"("status");

-- Brackets
CREATE TABLE "brackets" (
    "id"          TEXT NOT NULL,
    "eventId"     TEXT NOT NULL,
    "rounds"      INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "brackets_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "brackets_eventId_key" ON "brackets"("eventId");

-- Matches
CREATE TABLE "matches" (
    "id"            TEXT NOT NULL,
    "bracketId"     TEXT NOT NULL,
    "round"         INTEGER NOT NULL,
    "position"      INTEGER NOT NULL,
    "court"         TEXT,
    "scheduledAt"   TIMESTAMP(3),
    "startedAt"     TIMESTAMP(3),
    "finishedAt"    TIMESTAMP(3),
    "status"        "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "refereeId"     TEXT,
    "playerAId"     TEXT,
    "playerBId"     TEXT,
    "playerAType"   TEXT,
    "playerBType"   TEXT,
    "winnerId"      TEXT,
    "winnerType"    TEXT,
    "nextMatchId"   TEXT,
    "nextMatchSlot" TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "matches_bracketId_idx" ON "matches"("bracketId");
CREATE INDEX "matches_status_idx" ON "matches"("status");
CREATE INDEX "matches_scheduledAt_idx" ON "matches"("scheduledAt");

-- Games
CREATE TABLE "games" (
    "id"         TEXT NOT NULL,
    "matchId"    TEXT NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "scoreA"     INTEGER NOT NULL DEFAULT 0,
    "scoreB"     INTEGER NOT NULL DEFAULT 0,
    "finishedAt" TIMESTAMP(3),
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "games_matchId_idx" ON "games"("matchId");

-- MatchStats
CREATE TABLE "match_stats" (
    "id"         TEXT NOT NULL,
    "matchId"    TEXT NOT NULL,
    "athleteAId" TEXT,
    "athleteBId" TEXT,
    "gamesWon"   INTEGER NOT NULL DEFAULT 0,
    "gamesLost"  INTEGER NOT NULL DEFAULT 0,
    "pointsWon"  INTEGER NOT NULL DEFAULT 0,
    "pointsLost" INTEGER NOT NULL DEFAULT 0,
    "isWinner"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "match_stats_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "match_stats_matchId_idx" ON "match_stats"("matchId");

-- ResultAuditLogs
CREATE TABLE "result_audit_logs" (
    "id"        TEXT NOT NULL,
    "matchId"   TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "oldResult" JSONB NOT NULL,
    "newResult" JSONB NOT NULL,
    "reason"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "result_audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "result_audit_logs_matchId_idx" ON "result_audit_logs"("matchId");

-- RankingConfigs
CREATE TABLE "ranking_configs" (
    "id"                  TEXT NOT NULL,
    "tenantId"            TEXT NOT NULL,
    "season"              INTEGER NOT NULL,
    "discipline"          "Discipline" NOT NULL,
    "windowWeeks"         INTEGER NOT NULL DEFAULT 52,
    "maxTournamentsCount" INTEGER NOT NULL DEFAULT 10,
    "isActive"            BOOLEAN NOT NULL DEFAULT true,
    "validFrom"           TIMESTAMP(3) NOT NULL,
    "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"           TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ranking_configs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ranking_configs_tenantId_discipline_season_key" ON "ranking_configs"("tenantId", "discipline", "season");
CREATE INDEX "ranking_configs_tenantId_idx" ON "ranking_configs"("tenantId");

-- PointRules
CREATE TABLE "point_rules" (
    "id"              TEXT NOT NULL,
    "rankingConfigId" TEXT NOT NULL,
    "tournamentLevel" TEXT NOT NULL,
    "phase"           TEXT NOT NULL,
    "points"          INTEGER NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "point_rules_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "point_rules_rankingConfigId_tournamentLevel_phase_key" ON "point_rules"("rankingConfigId", "tournamentLevel", "phase");
CREATE INDEX "point_rules_rankingConfigId_idx" ON "point_rules"("rankingConfigId");

-- RankingEntries
CREATE TABLE "ranking_entries" (
    "id"               TEXT NOT NULL,
    "rankingConfigId"  TEXT NOT NULL,
    "athleteId"        TEXT,
    "pairId"           TEXT,
    "position"         INTEGER NOT NULL,
    "previousPosition" INTEGER,
    "points"           INTEGER NOT NULL,
    "tournamentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ranking_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ranking_entries_rankingConfigId_idx" ON "ranking_entries"("rankingConfigId");
CREATE INDEX "ranking_entries_athleteId_idx" ON "ranking_entries"("athleteId");
CREATE INDEX "ranking_entries_pairId_idx" ON "ranking_entries"("pairId");
CREATE INDEX "ranking_entries_position_idx" ON "ranking_entries"("position");

-- PushSubscriptions
CREATE TABLE "push_subscriptions" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "endpoint"  TEXT NOT NULL,
    "p256dh"    TEXT NOT NULL,
    "auth"      TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "push_subscriptions"("endpoint");
CREATE INDEX "push_subscriptions_userId_idx" ON "push_subscriptions"("userId");

-- Foreign Keys
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_athleteAId_fkey" FOREIGN KEY ("athleteAId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_athleteBId_fkey" FOREIGN KEY ("athleteBId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tournament_events" ADD CONSTRAINT "tournament_events_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "pairs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "brackets" ADD CONSTRAINT "brackets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "tournament_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "matches" ADD CONSTRAINT "matches_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "brackets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "games" ADD CONSTRAINT "games_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "result_audit_logs" ADD CONSTRAINT "result_audit_logs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ranking_configs" ADD CONSTRAINT "ranking_configs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "point_rules" ADD CONSTRAINT "point_rules_rankingConfigId_fkey" FOREIGN KEY ("rankingConfigId") REFERENCES "ranking_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ranking_entries" ADD CONSTRAINT "ranking_entries_rankingConfigId_fkey" FOREIGN KEY ("rankingConfigId") REFERENCES "ranking_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ranking_entries" ADD CONSTRAINT "ranking_entries_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ranking_entries" ADD CONSTRAINT "ranking_entries_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "pairs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
