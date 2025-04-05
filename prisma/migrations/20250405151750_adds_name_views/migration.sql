/*
  Warnings:

  - The required column `name` was added to the `YoutubeTranscriptionUserHybrid` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "YoutubeTranscriptionUserHybrid" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
