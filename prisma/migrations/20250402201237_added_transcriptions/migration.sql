-- CreateTable
CREATE TABLE "YoutubeTranscription" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "imageGenerationPrompt" TEXT NOT NULL,
    "detailedAnalysis" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "finalThought" TEXT NOT NULL,

    CONSTRAINT "YoutubeTranscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sentiment" (
    "id" TEXT NOT NULL,
    "yt_id" TEXT NOT NULL,
    "overallSentiment" TEXT NOT NULL,
    "positive" DOUBLE PRECISION NOT NULL,
    "neutral" DOUBLE PRECISION NOT NULL,
    "negative" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sentiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hashtags" (
    "id" TEXT NOT NULL,
    "yt_id" TEXT NOT NULL,

    CONSTRAINT "Hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "yt_id" TEXT NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keywords" (
    "id" TEXT NOT NULL,
    "yt_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeTranscription_videoId_key" ON "YoutubeTranscription"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Sentiment_yt_id_key" ON "Sentiment"("yt_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtags_yt_id_key" ON "Hashtags"("yt_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_yt_id_key" ON "Transcript"("yt_id");

-- CreateIndex
CREATE UNIQUE INDEX "Keywords_yt_id_key" ON "Keywords"("yt_id");

-- AddForeignKey
ALTER TABLE "Sentiment" ADD CONSTRAINT "Sentiment_yt_id_fkey" FOREIGN KEY ("yt_id") REFERENCES "YoutubeTranscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashtags" ADD CONSTRAINT "Hashtags_yt_id_fkey" FOREIGN KEY ("yt_id") REFERENCES "YoutubeTranscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_yt_id_fkey" FOREIGN KEY ("yt_id") REFERENCES "YoutubeTranscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
