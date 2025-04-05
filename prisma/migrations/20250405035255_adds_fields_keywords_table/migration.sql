/*
  Warnings:

  - You are about to drop the column `value` on the `Keywords` table. All the data in the column will be lost.
  - Added the required column `definition` to the `Keywords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surrounding_text` to the `Keywords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keywords" DROP COLUMN "value",
ADD COLUMN     "definition" TEXT NOT NULL,
ADD COLUMN     "surrounding_text" TEXT NOT NULL;
