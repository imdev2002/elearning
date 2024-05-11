-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "content" TEXT,
ADD COLUMN     "lessonType" "LessonType" NOT NULL DEFAULT 'VIDEO',
ADD COLUMN     "title" TEXT;
