-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ATTRACTION', 'MEAL', 'TRANSPORT', 'BREAK', 'ACCOMMODATION');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ActivityStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "timeSlot" "TimeSlot" NOT NULL DEFAULT 'MORNING',
ADD COLUMN     "type" "ActivityType" NOT NULL DEFAULT 'ATTRACTION',
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "itineraries" ADD COLUMN     "tips" TEXT[],
ADD COLUMN     "weatherNote" TEXT;

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
