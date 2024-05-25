/*
  Warnings:

  - The primary key for the `CoursesPaid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `checkoutSessionId` on table `CoursesPaid` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CoursesPaid" DROP CONSTRAINT "CoursesPaid_pkey",
ALTER COLUMN "checkoutSessionId" SET NOT NULL,
ADD CONSTRAINT "CoursesPaid_pkey" PRIMARY KEY ("courseId", "userId", "checkoutSessionId");
