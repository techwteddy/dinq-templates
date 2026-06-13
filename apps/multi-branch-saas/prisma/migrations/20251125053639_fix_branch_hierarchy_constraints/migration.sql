-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex: Ensure only one active HEADQUARTERS exists
-- This partial unique index allows only one non-deleted HEADQUARTERS
-- Soft-deleted HQ records won't block creation of new HQ
CREATE UNIQUE INDEX "unique_active_headquarters" ON "branches"("type") WHERE "deleted_at" IS NULL AND "type" = 'HEADQUARTERS';
