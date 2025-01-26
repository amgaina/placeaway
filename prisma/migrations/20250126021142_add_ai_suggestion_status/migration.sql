-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "aiGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "hasAISuggestions" BOOLEAN NOT NULL DEFAULT false;
