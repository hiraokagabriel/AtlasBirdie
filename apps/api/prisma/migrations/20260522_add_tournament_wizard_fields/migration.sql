-- Add wizard fields to Tournament
ALTER TABLE "tournaments"
  ADD COLUMN IF NOT EXISTS "regulationText"        TEXT,
  ADD COLUMN IF NOT EXISTS "registrationOpenAt"    TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "registrationCloseAt"   TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "maxInscriptionsGlobal" INTEGER;

-- Add wizard fields to TournamentEvent
ALTER TABLE "tournament_events"
  ADD COLUMN IF NOT EXISTS "seedCount"           INTEGER   NOT NULL DEFAULT 4,
  ADD COLUMN IF NOT EXISTS "bestOf"              INTEGER   NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS "pointsPerGame"       INTEGER   NOT NULL DEFAULT 21,
  ADD COLUMN IF NOT EXISTS "groupCount"          INTEGER,
  ADD COLUMN IF NOT EXISTS "playersPerGroup"     INTEGER,
  ADD COLUMN IF NOT EXISTS "advancePerGroup"     INTEGER,
  ADD COLUMN IF NOT EXISTS "tiebreakCriteria"    TEXT[]    NOT NULL DEFAULT ARRAY['WINS','SET_BALANCE','POINT_BALANCE'],
  ADD COLUMN IF NOT EXISTS "minIntervalMinutes"  INTEGER   NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS "isPublic"            BOOLEAN   NOT NULL DEFAULT true;

-- Create CourtType enum
DO $$ BEGIN
  CREATE TYPE "CourtType" AS ENUM ('MAIN', 'SECONDARY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create TournamentCourt table
CREATE TABLE IF NOT EXISTS "tournament_courts" (
  "id"                 TEXT         NOT NULL,
  "tournamentId"       TEXT         NOT NULL,
  "name"               TEXT         NOT NULL,
  "type"               "CourtType"  NOT NULL DEFAULT 'SECONDARY',
  "isShowCourt"        BOOLEAN      NOT NULL DEFAULT false,
  "openTime"           TEXT         NOT NULL,
  "closeTime"          TEXT         NOT NULL,
  "minIntervalMinutes" INTEGER      NOT NULL DEFAULT 15,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL,
  "deletedAt"          TIMESTAMP(3),

  CONSTRAINT "tournament_courts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tournament_courts_tournamentId_fkey"
    FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "tournament_courts_tournamentId_idx"
  ON "tournament_courts"("tournamentId");
