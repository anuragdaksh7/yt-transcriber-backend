/*
  Warnings:

  - Added the required column `hashtag` to the `Hashtags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hashtags" ADD COLUMN     "hashtag" TEXT NOT NULL;
