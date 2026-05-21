-- AlterTable: add document field to athletes
ALTER TABLE "athletes" ADD COLUMN "document" TEXT;

-- CreateIndex: unique document per tenant
CREATE UNIQUE INDEX "athletes_tenantId_document_key" ON "athletes"("tenantId", "document") WHERE "document" IS NOT NULL AND "deletedAt" IS NULL;
