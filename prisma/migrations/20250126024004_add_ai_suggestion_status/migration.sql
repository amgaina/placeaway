/*
  Warnings:

  - Changed the type of `role` on the `chat_messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ChatMessageRole" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "role",
ADD COLUMN     "role" "ChatMessageRole" NOT NULL;
