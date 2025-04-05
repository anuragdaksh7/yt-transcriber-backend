/*
  Warnings:

  - You are about to drop the `Transcript` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transcript" DROP CONSTRAINT "Transcript_yt_id_fkey";

-- DropTable
DROP TABLE "Transcript";

-- CreateTable
CREATE TABLE "YoutubeTranscriptionUserHybrid" (
    "id" TEXT NOT NULL,
    "yt_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "YoutubeTranscriptionUserHybrid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Keywords" ADD CONSTRAINT "Keywords_yt_id_fkey" FOREIGN KEY ("yt_id") REFERENCES "YoutubeTranscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeTranscriptionUserHybrid" ADD CONSTRAINT "YoutubeTranscriptionUserHybrid_yt_id_fkey" FOREIGN KEY ("yt_id") REFERENCES "YoutubeTranscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeTranscriptionUserHybrid" ADD CONSTRAINT "YoutubeTranscriptionUserHybrid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
