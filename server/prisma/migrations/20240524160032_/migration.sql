/*
  Warnings:

  - You are about to drop the `CoursedPaid` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CoursesPaidStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "CoursedPaid" DROP CONSTRAINT "CoursedPaid_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CoursedPaid" DROP CONSTRAINT "CoursedPaid_userId_fkey";

-- DropTable
DROP TABLE "CoursedPaid";

-- DropEnum
DROP TYPE "CoursedPaidStatus";

-- CreateTable
CREATE TABLE "CoursesPaid" (
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checkoutSessionId" TEXT,
    "status" "CoursesPaidStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "CoursesPaid_pkey" PRIMARY KEY ("courseId","userId")
);

-- AddForeignKey
ALTER TABLE "CoursesPaid" ADD CONSTRAINT "CoursesPaid_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesPaid" ADD CONSTRAINT "CoursesPaid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
