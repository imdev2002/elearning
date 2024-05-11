/*
  Warnings:

  - You are about to drop the column `timestamp` on the `SubmitForm` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `SubmitForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmitForm" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
