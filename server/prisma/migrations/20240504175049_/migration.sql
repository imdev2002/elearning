-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "totalDuration" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "duration" DOUBLE PRECISION;
